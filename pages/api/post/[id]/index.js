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
    const { comment, postId } = req.body
    const newPost = await prisma.post.update({
        where: {
            id: Number(postId)
        },
        data: {
            totalComments: { increment: 1 },
            comments: {
                create: {
                    content: comment,
                    userId: prismaUser.id,
                }

            }
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
            postId: Number(postId)
        },
        include: {
            user: true,
            post: true
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
            const session = await unstable_getServerSession(req, res, authOptions)
            if (session) {
                const prismaUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                });

                const like = await prisma.like.findMany({
                    where: {
                        AND: [
                            {
                                userId: prismaUser.id,
                            },
                            {
                                postId: Number(req.query.id),
                            }
                        ]
                    },
                    include: {
                        post: true,
                        user: true,
                    }
                })
                const post = await prisma.post.findUnique({
                    where: {
                        id: Number(req.query.id)
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
                        postId: Number(req.query.id),
                    },
                    include: {
                        user: true,

                    },
                });
                return res.status(200).json({ prismaUser, comments, post, like: like[0] ? (like[0].liked) : false })
            }
            if (!session) {
                const post = await prisma.post.update({
                    where: {
                        id: Number(req.query.id)
                    },
                    data: {
                        liked: false
                    }
                })


                const id = req.query.id
                const comments = await prisma.comment.findMany({
                    where: {
                        postId: Number(id)
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        user: true,
                        post: true
                    }
                })
                res.status(200).json({ prismaUser: {}, comments, post, like: false })
                break
            }
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}