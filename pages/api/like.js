import { prisma } from '../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

const post = async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        return res.status(200).json({ session })

    }
    const prismaUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })
    if (!prismaUser) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }
    const { id, liked } = req.body

    const post = await prisma.post.update({
        where: {
            id: Number(id),
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
                            postId: Number(id),
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
            id: Number(id),
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
            id: Number(id),
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
    const posts = await prisma.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            user: true,
            comments: true,
            likes: true,
        }
    })
    return res.status(201).json({ posts, session })

}


export default async function handle(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            post(req, res)
            break
        case 'GET':
        // const id = req.query.id
        // const session = await unstable_getServerSession(
        //     req,
        //     res,
        //     authOptions
        // );
        // if (session) {
        //     const prismaUser = await prisma.user.findUnique({
        //         where: { email: session.user.email },
        //     });
        //     const likes = await prisma.like.findMany({
        //         where: {
        //             userId: prismaUser.id,
        //         },
        //     });
        //     likes.map(async like => {
        //         const newPost = await prisma.post.update({
        //             where: {
        //                 id: like.postId,
        //             },
        //             data: {
        //                 liked: like.liked,
        //             },
        //         });
        //     });
        //     const posts = await prisma.post.findMany({
        //         where: {
        //             id: Number(id)
        //         },
        //         include: {
        //             comments: true,
        //             user: true,
        //             likes: true,
        //         },
        //     })
        //     res.status(200).json(posts)
        // } else {
        //     const posts = await prisma.post.findMany({
        //         include: {
        //             comments: true,
        //             user: true,
        //             likes: true,
        //         },
        //     })
        //     res.status(200).json(posts)
        // }
        // break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}