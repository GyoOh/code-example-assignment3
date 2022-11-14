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
    const { id, liked, totalLikes } = req.body

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

    const like = await prisma.like.upsert({
        where: {
            id: likeByUserandPost[0]?.id ? likeByUserandPost[0].id : 0,
        },
        update: {
            liked: likeByUserandPost[0]?.liked ? likeByUserandPost[0]?.liked : false,
        },
        create: {
            userId: prismaUser.id,
            liked: true,
            postId: Number(id),
        },
    })

    const likeByPost = await prisma.like.findMany({
        where: {
            postId: Number(id),
        },
        include: {
            post: true,
            user: true,
        }
    })


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
            liked: liked ? false : true,
            totalLikes: liked ? totalLikes - 1 : totalLikes + 1,
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