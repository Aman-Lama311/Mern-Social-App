import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPosts } from "../redux/postSlice";

const useAllGetPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/all`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPosts();
  }, []);
};
export default useAllGetPosts;
