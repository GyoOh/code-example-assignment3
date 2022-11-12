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
    const post = await prisma.post.update({
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
    res.status(201).json({ post, session })
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
            res.status(200).json(comments)
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}