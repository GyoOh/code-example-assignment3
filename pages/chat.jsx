import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import MessageForm from "../components/MessagesForm";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const pusher = new Pusher("af6ea68869a94abb887c", {
      cluster: "us3",
    });
    const channelName = "my-channel";

    const channel = pusher.subscribe(channelName);
    channel.bind("my-event", function (data) {
      setMessages(messages => [...messages, data]);
    });

    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, []);
  const submitHandler = async message => {
    await axios.post("/api/messages", { message });
  };
  return (
    <div>
      <h1>Chat room</h1>
      <MessageForm onSubmit={submitHandler} />
      {messages?.map(message => (
        <p key={message.id} className="text-gray-100">
          {message.message}
        </p>
      ))}
    </div>
  );
}
