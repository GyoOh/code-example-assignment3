import { useState } from "react";
import Button from "../Button";
export default function MessageForm({ onSubmit }) {
  const [message, setMessage] = useState("");
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit({ message });
    setMessage("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6" method="POST">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            id="message"
            name="message"
            type="text"
            autoComplete="message"
            required
            className="bg-dark h-20 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-100 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Message"
          />
          <Button type="submit">Send Message</Button>
        </div>
      </div>
    </form>
  );
}
