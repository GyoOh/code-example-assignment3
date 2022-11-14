import Post from "../../components/Post";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NewPostForm from "../../components/CommentForm";
import Comments from "../../components/Comments";
import axios from "axios";
import { prisma } from "../../server/db/client";
import useSWR from "swr";
import Head from "next/head";
import Loader from "../../components/Loader";
import { signIn } from "next-auth/react";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Detail({ post }) {
  const [isClicked, setIsclicked] = useState(true);
  const [newPost, setNewPost] = useState("");
  const { data, mutate } = useSWR(`/api/post/${post.id}`, fetcher);
  const route = useRouter();

  async function likeHandler() {
    const res = await axios.post(`/api/post/${post.id}/like`, {
      postId: post.id,
      liked: newPost.id ? newPost.liked : post.liked,
    });
    if (!res.data.session) {
      signIn();
    }
    return setNewPost(res.data.post);
  }
  const commentHandler = () => {
    setIsclicked(!isClicked);
  };
  const shareHandler = () => {};
  const commentSubmitHandler = async ({ comment }) => {
    const res = await axios.post(`/api/post/${post.id}`, {
      comment,
      postId: Number(post.id),
    });
    if (!res.data.session) {
      signIn();
    }
    mutate();
    route.replace(route.asPath);
    return;
  };
  if (!data) return <Loader />;
  return (
    <>
      <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
        <Head>
          <title>{post.title}</title>
        </Head>
        <Post
          post={newPost?.id ? newPost : post}
          liked={newPost?.id ? newPost.liked : post.liked}
          onComment={commentHandler}
          onLike={likeHandler}
          user={post.user ? post.user : null}
          onShare={shareHandler}
        />
        {isClicked ? (
          <>
            <NewPostForm
              onSubmit={commentSubmitHandler}
              user={post.user ? post.user : null}
            />
            <Comments comments={data} />
          </>
        ) : null}
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const posts = await prisma.post.findMany();
  const paths = posts.map(post => {
    return {
      params: { id: post.id.toString() },
    };
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async context => {
  const post = await prisma.post.findUnique({
    where: { id: Number(context.params.id) },
    include: {
      user: true,
      likes: true,
      comments: true,
    },
  });
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
    revalidate: 10,
  };
};
