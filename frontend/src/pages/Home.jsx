import { Outlet } from "react-router-dom";
import Feed from "../components/Feed";
import RightBar from "../components/RightBar";
import useAllGetPosts from "../hooks/useAllGetPosts";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";

const Home = () => {
  useAllGetPosts();
  useGetSuggestedUsers();
  return (
    <div>
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightBar />
    </div>
  );
};
export default Home;
