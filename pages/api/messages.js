import Pusher from "pusher";

export default function handler(req, res) {
    const { method } = req
    switch (method) {
        case 'POST':
            const { message } = req.body.message

            const pusher = new Pusher({
                appId: "1509710",
                key: "af6ea68869a94abb887c",
                secret: "3f8441073a40818fe2e8",
                cluster: "us3",
            });

            pusher.trigger("my-channel", "my-event", {
                id: Math.random(),
                message
            });
            res.status(200).json({ message })
            break
        default:
            res.status(400).json({ success: false })
    }
}
