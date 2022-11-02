import NewPostForm from "../components/NewPostForm";
import axios from "axios";

export default function CreatePost() {
  const submitHandler = async data => {
    const res = await axios.post("/api/posts", data);
    console.log(res);
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
