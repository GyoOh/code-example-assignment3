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
    const { postId, liked, totalLikes } = req.body
    const likeByUserandPost = await prisma.like.findMany({
        where: {
            AND: [
                {
                    userId: prismaUser.id,
                },
                {
                    postId: Number(postId),
                }
            ]
        },
        include: {
            post: true,
            user: true,
        }
    })
    const like = await prisma.like.upsert({
        where: {
            id: likeByUserandPost[0]?.id ? likeByUserandPost[0].id : 0,
        },
        update: {
            liked: likeByUserandPost[0]?.id ? !(likeByUserandPost[0].liked) : false,
        },
        create: {
            userId: prismaUser.id,
            liked: true,
            postId: Number(postId),
        },
    })
    const likeByPost = await prisma.like.findMany({
        where: {
            postId: Number(postId),
        },
        include: {
            post: true,
            user: true,
        }
    })

    const posts = await prisma.post.update({
        where: {
            id: Number(postId),
        },
        include: {
            comments: true,
            user: true,
            likes: true,
        },
        data: {
            liked: like.liked,
            totalLikes: likeByPost.filter(like => like.liked).length,
        }
    })
    const post = await prisma.post.findUnique({
        where: {
            id: Number(postId)
        },
        include: {
            comments: {
                include: {
                    user: true
                }
            },
            user: true,
            likes: true
        }
    })

    const comments = await prisma.comment.findMany({
        where: {
            postId: Number(postId),
        },
        include: {
            user: true,
            post: true,
        }
    })
    res.status(201).json({ post, session, comments })
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

                const likeByUserandPost = await prisma.like.findMany({
                    where: {
                        AND: [
                            {
                                userId: prismaUser.id,
                            },
                            {
                                postId: Number(id),
                            }
                        ]
                    },
                    include: {
                        post: true,
                        user: true,
                    }
                })
                const updatedPost = await prisma.post.update({
                    where: {
                        id: Number(id),
                    },
                    include: {
                        comments: true,
                        user: true,
                        likes: true,
                    },
                    data: {
                        liked: likeByUserandPost[0] ? !(likeByUserandPost[0].liked) : false,
                    }
                })
                const post = await prisma.post.findUnique({
                    where: {
                        id: Number(id)
                    },
                    include: {
                        comments: true,
                        user: true,
                        likes: true,
                    },
                })
                res.status(200).json(post)
            } else {

                await prisma.post.updateMany({
                    where: {
                        liked: true
                    },
                    data: {
                        liked: false
                    }
                })
                const post = await prisma.post.findUnique({
                    where: {
                        id: Number(id)
                    },
                    include: {
                        comments: true,
                        user: true,
                        likes: true,
                    },
                })
                res.status(200).json(post)
            }
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}