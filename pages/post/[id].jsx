import Post from "../../components/Post";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NewPostForm from "../../components/CommentForm";
import Comments from "../../components/Comments";
import axios from "axios";
import { prisma } from "../../server/db/client";
import useSWR from "swr";
import Head from "next/head";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function detail({ post }) {
  const [newPost, setNewPost] = useState([]);
  const { data, mutate } = useSWR(`/api/post/${post.id}`, fetcher);
  const route = useRouter();

  async function likeHandler() {
    const res = axios.post(`/api/post/${post.id}/like`, {
      postId: post.id,
      liked: newPost.liked ? newPost.liked : post.liked,
    });

    const response = await res;
    setNewPost(response.data);
    mutate();
    route.replace(route.asPath);
    return;
  }
  const commentHandler = () => {};
  const shareHandler = () => {};
  const commentSubmitHandler = async ({ comment }) => {
    const res = await axios.post(`/api/post/${post.id}`, {
      comment,
      postId: Number(post.id),
    });
    mutate([...data, { comment }]);
    route.replace(route.asPath);
    return;
  };
  return (
    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      <Head>
        <title>{post.title}</title>
      </Head>
      <Post
        post={newPost?.post ? newPost.post : post}
        liked={newPost?.liked ? newPost.liked : post.liked}
        onComment={commentHandler}
        onLike={likeHandler}
        user={post.user ? post.user : null}
        onShare={shareHandler}
      />
      <NewPostForm
        onSubmit={commentSubmitHandler}
        user={post.user ? post.user : null}
      />
      {data && <Comments comments={data} />}
    </div>
  );
}

export const getServerSideProps = async context => {
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
  };
};
