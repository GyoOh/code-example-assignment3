import Post from "../../components/Post";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NewPostForm from "../../components/CommentForm";
import Comments from "../../components/Comments";
import axios from "axios";
import { prisma } from "../../server/db/client";
import Head from "next/head";
import Loader from "../../components/Loader";
import { useSession, signIn } from "next-auth/react";

export default function Detail({ post, likes }) {
  const [isClicked, setIsclicked] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [data, setData] = useState([]);

  const [updatedPost, setUpdatedPost] = useState({});
  const route = useRouter();
  const session = useSession();
  let thisLike = likes.find(
    like => like.user.email == session?.data?.user?.email
  );

  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  useEffect(() => {
    (async () => {
      const res = await axios.get(`/api/post/${post.id}`);
      console.log(res.data);
      setUser(res.data.prismaUser);
      setComments(res.data.comments);
      setLiked(res.data.like);
      setTotalComments(Number(res.data.post.totalComments));
      setTotalLikes(Number(res.data.post.totalLikes));
    })();
  }, []);
  async function likeHandler() {
    if (!user) {
      signIn();
    }
    liked ? setTotalLikes(totalLikes + 1) : setTotalLikes(totalLikes - 1);
    if (newPost) {
      setNewPost({ ...newPost, totalLikes });
    } else {
      setNewPost({ ...post, totalLikes });
    }
    setLiked(!liked);

    const res = await axios.post(`/api/post/${post.id}/like`, {
      postId: post.id,
      liked: newPost?.post?.id ? newPost.post.liked : post.liked,
      totalLikes: newPost?.post?.id ? newPost.post.totalLikes : post.totalLikes,
    });

    return;
  }
  const commentHandler = () => {
    setIsclicked(!isClicked);
  };
  const shareHandler = () => {};
  const commentSubmitHandler = ({ comment }) => {
    if (!user) {
      signIn();
    }
    const newComment = {
      id: totalComments,
      createdAt: new Date(),
      content: comment,
      user: {
        image: user.image,
        name: session?.data?.user?.name,
      },
    };
    setComments([...comments, newComment]);
    setTotalComments(totalComments + 1);
    setNewPost({ ...post, totalComments: totalComments + 1 });
    axios.post(`/api/post/${post.id}`, {
      comment,
      postId: Number(post.id),
    });

    return;
  };
  if (!comments || !post) return <Loader />;
  return (
    <>
      <div className="pt-8 pb-10 lg:pt-12 lg:pb-14 mx-auto max-w-7xl px-2">
        <Head>
          <title>{post.title}</title>
        </Head>
        <Post
          post={newPost ? newPost : post}
          liked={liked}
          onComment={commentHandler}
          onLike={likeHandler}
          user={post.user ? post.user : null}
          onShare={shareHandler}
        />
        {isClicked ? (
          <>
            <NewPostForm
              onSubmit={commentSubmitHandler}
              user={user ? user : null}
            />
            {comments && <Comments comments={comments} />}
          </>
        ) : null}
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  // const posts = await prisma.post.findMany();

  // const paths = posts.map(post => {
  //   return {
  //     params: { id: post.id.toString() },
  //   };
  // });

  return {
    paths: [],
    fallback: "blocking",
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
  const likes = await prisma.like.findMany({
    where: { postId: Number(context.params.id) },
    include: {
      user: true,
    },
  });

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
      likes: JSON.parse(JSON.stringify(likes)),
    },
    revalidate: 1,
  };
};
