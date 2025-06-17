import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSuggestedUsers } from "../redux/authSlice";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/suggested`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
