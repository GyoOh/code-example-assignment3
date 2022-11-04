import { prisma } from '../../server/db/client'

function getTitle(code) {
    return code.trim().split('\n')[0].replace('//', '')
}
function getPostId(comments, id) {
    return comments.filter(comment => comment.postId == Number(id))
}

export default async function handle(req, res) {
    const users = await prisma.user.findMany()
    const { method } = req

    switch (method) {
        case 'POST':
            // get the title and content from the request body
            const { language, code } = req.body
            const title = getTitle(code)
            console.log("req.body", req.body)
            // count the number of comments in the posts table
            const post = await prisma.post.create({
                data: {
                    title,
                    language,
                    code,
                    userId: users[0].id
                }
            })

            console.log("post", post)
            // send the post object back to the client
            res.status(201).json(post)
            break
        case 'GET':
            // get all posts from the database
            const posts = await prisma.post.findMany({
                // select: {
                //     totalLikes: {
                //         select: {
                //             likes: true
                //         }
                //     },
                // },
            })
            console.log("posts", posts)
            // const comments = await prisma.comment.findMany()

            // const count = await prisma.post.count({
            //     where: {
            //         totalComments: getPostId(comments, posts.map(post => post.id))
            //     }
            // })
            // console.log(count)


            // send the posts back to the client
            res.status(200).json({ posts, users })
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}