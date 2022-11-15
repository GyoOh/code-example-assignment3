import Button from "../components/Button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import PostSmall from "../components/PostSmall";
import Loader from "../components/Loader";
import { signIn } from "next-auth/react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/posts");
      setPosts(res.data);
      setIsLoading(true);
      setSession(res.data.session);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    })();
  }, []);

  const route = useRouter();
  const likeHandler = async (id, liked, totalLikes) => {
    const res = await axios.post("/api/like", { id, liked, totalLikes });
    if (!res.data.session) {
      return signIn();
    }
    return setPosts(res.data);
  };
  if (!posts) return <Loader />;
  return (
    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-100 sm:text-4xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-300">Code snippet</span>
          </h1>
          <div className="mt-6 text-gray-300 space-y-6">
            <ul>
              {posts?.posts?.map(it => (
                <li key={it.id}>
                  <PostSmall
                    post={it}
                    onLike={() => {
                      likeHandler(it.id, it.liked, it.totalLikes);
                    }}
                    href={`/post/${it.id}`}
                    onComment={() => route.push(`/post/${it.id}`)}
                    onShare={() => route.push(`/post/${it.id}`)}
                    user={it.user ? it.user : null}
                    className="my-10"
                  ></PostSmall>
                </li>
              ))}
            </ul>
            <p className="text-lg">
              {session ? (
                <Button onClick={() => route.push("/createPost")}>
                  create a Post
                </Button>
              ) : (
                <Button onClick={() => signIn()}>
                  Sign in to create a post
                </Button>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
