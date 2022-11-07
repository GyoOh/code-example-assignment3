import { prisma } from '../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

function getTitle(code) {
    return code.trim().split('\n')[0].replace('//', '')
}
async function post(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    const prismaUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!prismaUser) {
        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    const { language, code } = req.body
    const title = getTitle(code)
    const post = await prisma.post.create({
        data: {
            title,
            language,
            code,
            userId: prismaUser.id,
        },
    })
    res.status(201).json(post)
}


export default async function handle(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const { method } = req

    switch (method) {
        case 'POST':
            post(req, res)
            break
        case 'GET':
            if (session) {
                const prismaUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                })
                const likes = await prisma.like.findMany({
                    where: {
                        userId: prismaUser.id,
                    },
                })
                console.log(likes)
                likes.map(async like => {
                    const newPost = await prisma.post.update({
                        where: {
                            id: like.postId
                        },
                        data: {
                            liked: like.liked
                        }
                    })
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
                res.status(200).json({ posts })
                return
            } else {
                const newPosts = await prisma.post.findMany({
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        user: true,
                        comments: true,
                        likes: true,
                    },
                })
                const posts = newPosts.map(post => {
                    return {
                        ...post,
                        liked: false
                    }
                })
                res.status(200).json({ posts })
                break
            }
        default:
            res.setHeader('Allow', ['POST', 'GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}