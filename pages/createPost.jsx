import NewPostForm from "../components/NewPostForm";
import axios from "axios";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function CreatePost() {
  const route = useRouter();
  const submitHandler = async data => {
    const res = await axios.post("/api/posts", data);
    if (!res.data.session) {
      return signIn();
    }
    route.push("/");
  };
  const changeHandler = data => {
    console.log(data);
  };
  return (
    <div>
      <NewPostForm onChange={changeHandler} onSubmit={submitHandler} />
    </div>
  );
}
