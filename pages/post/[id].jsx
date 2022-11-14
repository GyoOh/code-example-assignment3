import Post from "../../components/Post";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NewPostForm from "../../components/CommentForm";
import Comments from "../../components/Comments";
import axios from "axios";
import { prisma } from "../../server/db/client";
import Head from "next/head";
import Loader from "../../components/Loader";
import { signIn } from "next-auth/react";

export default function Detail({ post }) {
  const [isClicked, setIsclicked] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [data, setData] = useState([]);
  const route = useRouter();
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/post/${post.id}`);

      setData(res.data);
    })();
  }, []);
  console.log("data", data);

  async function likeHandler() {
    const res = await axios.post(`/api/post/${post.id}/like`, {
      postId: post.id,
      liked: newPost?.post?.id ? newPost.post.liked : post.liked,
      totalLikes: newPost?.post?.id ? newPost.post.totalLikes : post.totalLikes,
    });
    if (!res.data.session) {
      signIn();
    }

    return setNewPost(res.data);
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
    setNewPost(res.data);
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
          post={newPost?.post?.id ? newPost.post : post}
          liked={newPost?.post?.id ? newPost.post.liked : post.liked}
          onComment={commentHandler}
          onLike={likeHandler}
          user={post.user ? post.user : null}
          onShare={shareHandler}
        />
        {isClicked ? (
          <>
            <NewPostForm
              onSubmit={commentSubmitHandler}
              user={data?.prismaUser}
            />
            {data?.comments ? (
              <Comments
                comments={newPost?.post?.id ? newPost.comments : data?.comments}
              />
            ) : null}
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
