import { prisma } from '../../../../server/db/client'

export default async function handle(req, res) {

    const { method } = req

    switch (method) {
        case 'POST':
            // get the title and content from the request body
            const { comment, postId } = req.body
            const users = await prisma.user.findMany()
            console.log("req.body", req.body)
            // use prisma to create a new post using that data
            const post = await prisma.comment.create({
                data: {
                    content: comment,
                    userId: Number(users[0].id),
                    postId: Number(postId)
                }
            })
            const posts = await prisma.post.update({
                where: { id: Number(postId) },
                data: { totalComments: { increment: 1 } }
            })
            // send the post object back to the client
            res.status(201).json(post)
            break
        case 'GET':
            // get all posts from the database
            const id = req.query.id
            if (id) {
                const comments = await prisma.comment.findMany({
                    where: {
                        postId: Number(id)
                    }
                })
                // send the posts back to the client
                res.status(200).json(comments)
            } else {
                const comments = await prisma.comment.findMany()
                res.status(200).json(comments)
            }
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}