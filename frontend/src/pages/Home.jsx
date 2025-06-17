import { Outlet } from "react-router-dom";
import Feed from "../components/Feed";
import RightBar from "../components/RightBar";
import useAllGetPosts from "../hooks/useAllGetPosts";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";

const Home = () => {
  useAllGetPosts();
  useGetSuggestedUsers();

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-2 sm:px-4">
      {/* Feed and Outlet */}
      <div className="flex-1">
        <Feed />
        <Outlet />
      </div>

      {/* Right Sidebar - hidden on small screens */}
      <div className="hidden lg:block w-[280px] ml-4">
        <RightBar />
      </div>
    </div>
  );
};

export default Home;
