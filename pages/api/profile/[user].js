import { prisma } from '../../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"
export default async function handle(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const { method } = req
    switch (method) {
        case 'GET':
            if (session) {
                const prismaUser = await prisma.user.findUnique({
                    where: { email: session.user.email },
                })
                const posts = await prisma.post.findMany({
                    where: {
                        userId: prismaUser.id,
                    },
                    include: {
                        user: true,
                        comments: true,
                        likes: true,
                    },
                })
                const comments = await prisma.comment.findMany({
                    where: {
                        userId: prismaUser.id,
                    },
                    include: {
                        user: true,
                        post: true,
                    },
                })
                res.status(200).json({ posts, comments })
            } else {

                await prisma.post.updateMany({
                    where: {
                        liked: true
                    },
                    data: {
                        liked: false
                    }
                })
                res.status(401).json({ error: 'Unauthorized' })
            }
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}