import { prisma } from '../../../../server/db/client'

export default async function handle(req, res) {

    const { method } = req

    switch (method) {
        case 'POST':

            // get the title and content from the request body
            const users = await prisma.user.findMany()
            // use prisma to create a new post using that data

            const posts = await prisma.post.update({
                where: { id: Number(postId) },
                data: { liked: liked ? false : true }
            })

            const likes = await prisma.like.create({
                data: {
                    liked: true,
                    userId: Number(users[0].id),
                    postId: Number(id)
                }
            })
            // const posts = await prisma.like.update({
            //     where: { id: Number(id) },
            //     data: { totalLikes: { increment: 1 } }
            // })
            // send the post object back to the client
            res.status(201).json({ posts, likes })
            break
        case 'PUT':
            // get the liked from the request body
            const { postId, userId, liked } = req.body
            // use prisma to create a new post using that data
            const post = await prisma.post.update({
                where: { id: Number(postId) },
                data: { liked: !liked ? true : false }
            })
            // const like = await prisma.like.update({
            //     where: { postId: parseInt(postId), userId: parseInt(userId) },
            //     data: { liked: !liked ? true : false }
            // })

            res.json(post)
            break
        case 'GET':
            if (id) {
                const likes = await prisma.like.findMany({
                    where: {
                        postId: Number(id)
                    }
                })
                // send the posts back to the client
                res.status(200).json(likes)
            } else {
                const likes = await prisma.like.findMany()
                res.status(200).json(likes)
            }
            break

        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}