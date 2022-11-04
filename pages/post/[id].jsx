import PostSmall from "../../components/PostSmall";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NewPostForm from "../../components/CommentForm";
import Comments from "../../components/Comments";
import axios from "axios";
import { prisma } from "../../server/db/client";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function detail({ post, users }) {
  const [likes, setLikes] = useState([]);
  // const like = likes.find(
  //   like => like.postId == post.id && like.userId == users[0].id
  // );
  const [isLiked, setIsLiked] = useState(false);
  const { data, error } = useSWR(`/api/post/${post.id}`, fetcher);
  const route = useRouter();

  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/post/${post.id}/like`);
      setLikes(res.data);
    })();
  }, [likes]);

  const likeHandler = () => {
    if (likes.length == 0) {
      axios.post(`/api/post/${post.id}/like`, {
        post,
        likes: likes
          ? likes.find(
              like => like.postId == post.id && like.userId == users[0].id
            )
          : likes[0],
        userId: users[0].id,
      });
      return;
    } else {
      axios.put(`/api/post/${post.id}/like`, {
        post,
        likes: likes
          ? likes.find(
              like => like.postId == post.id && like.userId == users[0].id
            )
          : likes[0],
        userId: users[0].id,
      });
      return;
    }
  };
  const commentHandler = () => {};
  const shareHandler = () => {};
  const commentSubmitHandler = async ({ comment }) => {
    const res = await axios.post(`/api/post/${post.id}`, {
      comment,
      postId: Number(post.id),
    });
    route.push(`/post/${post.id}`);
  };
  return (
    <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
      <PostSmall
        post={post}
        liked={post.liked}
        onComment={commentHandler}
        onLike={likeHandler}
        onShare={shareHandler}
        href={`/post/${post.id}`}
      />
      <NewPostForm onSubmit={commentSubmitHandler} />;
      {data && <Comments comments={data} />}
    </div>
  );
}

export const getServerSideProps = async context => {
  const post = await prisma.post.findUnique({
    where: { id: Number(context.params.id) },
  });

  // const likes = await prisma.like.findMany();
  // const like = likes?.find(it => it.postId == post.id);

  const users = await prisma.user.findMany();
  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      // likes: like ? JSON.parse(JSON.stringify(like)) : [],
      users: JSON.parse(JSON.stringify(users)),
    },
  };
};
