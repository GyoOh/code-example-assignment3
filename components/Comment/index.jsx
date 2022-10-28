import Image from "next/image"

import formatTimeAgo from "../../utils/formatTimeAgo"

export default function Comment({ comment, user, className }) {
  return (
    <div className={"flex space-x-3 " + className}>
      <div className="flex-shrink-0">
        <Image
          className="h-6 w-6 rounded-full"
          width={50}
          height={50}
          src={user.image}
          alt={user.name}
        />
      </div>
      <div className="flex-1 space-y-1 overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {user.name}
          </h3>
          <p className="text-sm text-gray-300">{formatTimeAgo(comment.createdAt)}</p>
        </div>
        <pre className="text-md text-gray-300 whitespace-pre-wrap break-words">
           <code>
            {comment.content}
           </code>
        </pre>
      </div>
    </div>
  )
}