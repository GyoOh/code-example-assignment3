import { prisma } from '../../server/db/client'

function getTitle(code) {
    return code.trim().split('\n')[0].replace('//', '')
}


export default async function handle(req, res) {
    const { method } = req

    switch (method) {
        case 'POST':
            // get the title and content from the request body
            const { language, code } = req.body
            const title = getTitle(code)
            console.log("req.body", req.body)
            // use prisma to create a new post using that data
            const post = await prisma.post.create({
                data: {
                    title,
                    language,
                    code
                }
            })
            console.log("post", post)
            // send the post object back to the client
            res.status(201).json(post)
            break
        case 'GET':
            // get all posts from the database
            const posts = await prisma.post.findMany()
            // send the posts back to the client
            res.status(200).json(posts)
            break
        default:
            res.status(405).end(`Method ${method} Not Allowed`)
    }

}