import Button from "../components/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import PostSmall from "../components/PostSmall";

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
    })();
  }, []);
  console.log(posts);
  const route = useRouter();
  return (
    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
          <span className="block">Welcome to</span>
          <span className="block text-indigo-300">Gyo's Assignment</span>
        </h1>
        <div className="mt-6 text-gray-300 space-y-6">
          <ul>
            {posts?.posts?.map(it => (
              <li key={it.id}>
                <PostSmall
                  post={it}
                  onLike={() => route.push(`/post/${it.id}`)}
                  href={`/post/${it.id}`}
                  onComment={() => route.push(`/post/${it.id}`)}
                  onShare={() => route.push(`/post/${it.id}`)}
                  user={it.user ? it.user : null}
                  className="my-10"
                >
                  {!posts && <div>loading...</div>}
                </PostSmall>
              </li>
            ))}
          </ul>
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
