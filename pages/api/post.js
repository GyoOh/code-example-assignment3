import { prisma } from '../../server/db/client'
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async function handle(req, res) {
    const { method } = req
    const session = await unstable_getServerSession(req, res, authOptions)

    switch (method) {
        case 'GET':
            const posts = await prisma.post.findMany()
            res.status(200).json({ posts, user: prismaUser ? prismaUser : null })
            break

        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}