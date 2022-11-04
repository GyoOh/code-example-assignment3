import NewPostForm from "../components/NewPostForm";
import axios from "axios";
import { useRouter } from "next/router";

export default function CreatePost() {
  const route = useRouter();
  const submitHandler = async data => {
    const res = await axios.post("/api/posts", data);
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
