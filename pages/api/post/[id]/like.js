import { prisma } from '../../../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]"

const post = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(200).json({ session })
    }
    const prismaUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!prismaUser) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const { postId, liked } = req.body
    const post = await prisma.post.update({
        where: {
            id: Number(postId),
        },
        include: {
            comments: true,
            user: true,
            likes: true,
        },
        data: {
            liked: !liked,
            likes: {
                upsert: {
                    where: {
                        userId_postId: {
                            userId: prismaUser.id,
                            postId: Number(postId),
                        }
                    },
                    update: {
                        liked: !liked,
                    },
                    create: {
                        userId: prismaUser.id,
                        liked: true,
                    },
                },
            }
        }
    })
    const likes = await prisma.post.findUnique({
        where: {
            id: Number(postId),
        },
        select: {
            likes: {
                select: {
                    liked: true,
                }
            }
        }
    })
    const likesCount = likes.likes.filter(like => like.liked).length
    const newPost = await prisma.post.update({
        where: {
            id: Number(postId),
        },
        include: {
            comments: true,
            user: true,
            likes: true,
        },
        data: {
            totalLikes: likesCount,
        }
    })
    console.log(newPost)
    res.status(201).json({ newPost, session })
    return
}


export default async function handle(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            post(req, res)
            break
        case 'GET':
            const id = req.query.id
            const session = await unstable_getServerSession(
                req,
                res,
                authOptions
            );
            if (session) {
                const prismaUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });
                const likes = await prisma.like.findMany({
                    where: {
                        userId: prismaUser.id,
                    },
                });
                likes.map(async like => {
                    const newPost = await prisma.post.update({
                        where: {
                            id: like.postId,
                        },
                        data: {
                            liked: like.liked,
                        },
                    });
                });
                const posts = await prisma.post.findMany({
                    where: {
                        id: Number(id)
                    },
                    include: {
                        comments: true,
                        user: true,
                        likes: true,
                    },
                })
                res.status(200).json(posts)
            } else {
                const posts = await prisma.post.findMany({
                    include: {
                        comments: true,
                        user: true,
                        likes: true,
                    },
                })
                res.status(200).json(posts)
            }
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}