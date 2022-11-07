import { useSession, signIn, signOut } from "next-auth/react";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { prisma } from "../server/db/client";
import axios from "axios";
import { useState, useEffect } from "react";
import PostSmall from "../components/PostSmall";
import Comments from "../components/Comments";
import { useRouter } from "next/router";

export default function Component({ comments }) {
  const { data: session } = useSession();
  const [userState, setUserState] = useState([]);
  const route = useRouter();
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/profile/${session.user.email}`);
      setUserState(res.data);
    })();
  }, []);
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        <div className="flex flex-col items-center justify-center">
          <div className="mt-6 text-gray-300 space-y-6">
            <h3 className="text-2xl font-bold">Your Posts</h3>
            <ul>
              {userState?.posts?.map(it => (
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
                    {!userState && <div>loading...</div>}
                  </PostSmall>
                </li>
              ))}
            </ul>
            <div>
              <h3 className="text-2xl font-bold">Your Comments</h3>
              <Comments comments={comments} />
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  const comments = await prisma.comment.findMany({
    where: {
      userId: prismaUser.id,
    },
    include: {
      post: true,
      user: true,
    },
  });

  return {
    props: {
      session,
      comments: JSON.parse(JSON.stringify(comments)),
    },
  };
}
