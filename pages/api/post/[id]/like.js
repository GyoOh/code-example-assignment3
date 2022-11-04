import { prisma } from '../../../../server/db/client'

export default async function handle(req, res) {

    const { method } = req


    switch (method) {
        case 'POST':
            const data = req.body
            console.log("data", data)

            // get the title and content from the request body
            const users = await prisma.user.findMany()
            // use prisma to create a new post using that data

            const posts = await prisma.post.update({
                where: { id: Number(data.post.id) },
                data: { liked: data.post.liked ? false : true }
            })

            const like = await prisma.like.create({
                data: {
                    liked: true,
                    userId: Number(data.userId),
                    postId: Number(data.post.id)
                }
            })

            res.status(201).json({ posts, like })
            break
        case 'PUT':
            // get the liked from the request body
            const { post, likes } = req.body
            // use prisma to create a new post using that data
            if (likes.liked) {
                const updatedPost = await prisma.post.update({
                    where: { id: Number(post.id) },
                    data: {
                        liked: likes.liked ? false : true,
                        totalLikes: {
                            decrement: 1
                        }
                    }
                })
                const updatedLike = await prisma.like.update({
                    where: { id: likes.id },
                    data: { liked: likes.liked ? false : true }
                })
                res.json({ updatedPost, updatedLike })
                break
            } else {
                const updatedPost = await prisma.post.update({
                    where: { id: Number(post.id) },
                    data: {
                        liked: likes.liked ? false : true,
                        totalLikes: {
                            increment: 1
                        }
                    }
                })
                const updatedLike = await prisma.like.update({
                    where: { id: likes.id },
                    data: { liked: likes.liked ? false : true }
                })
                res.json({ updatedPost, updatedLike })
                break
            }



        case 'GET':
            const id = req.query.id
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