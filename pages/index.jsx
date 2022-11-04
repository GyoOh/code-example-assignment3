import Button from "../components/Button";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import axios from "axios";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Home() {
  const [liked, setLiked] = useState(false);
  const { data, error } = useSWR("/api/posts", fetcher);
  const route = useRouter();
  console.log(data);

  const likeHandler = () => {};
  const commentHandler = () => {};
  const shareHandler = () => {};
  const clickHandler = async post => {
    route.push(`/post/${post.id}`);
    // const res = await axios.post("/api/post", post);
  };
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          <span className="block">Welcome to</span>
          <span className="block text-indigo-300">Gyo's Assignment</span>
        </h1>
        <div className="mt-6 text-gray-300 space-y-6">
          {data?.posts.map(it => (
            <div
              key={it.id}
              onClick={async () => {
                route.push(`/post/${it.id}`);
              }}
            >
              <Post
                post={it}
                liked={liked}
                onComment={commentHandler}
                onLike={likeHandler}
                onShare={shareHandler}
                user={data?.users.find(user => user.id === it.userId)}
              >
                {error && <div>failed to load</div>}
                {!data && <div>loading...</div>}
              </Post>
            </div>
          ))}
          <p className="text-lg">
            <Button
              onClick={() => route.push("/createPost")}
              children="Create a post"
            />
          </p>
        </div>
      </div>
    </div>
  );
}
