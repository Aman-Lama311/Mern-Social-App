import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-full lg:w-[280px] flex flex-col gap-4 py-6">
      {/* User Profile Preview */}
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?._id}`} className="w-10 h-10">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm bg-gray-500">
                CN
              </div>
            )}
          </div>
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${user?._id}`}
            className="font-semibold text-sm hover:underline"
          >
            {user?.username}
          </Link>
          <p className="text-sm text-gray-400">{user?.bio || "bio..."}</p>
        </div>
      </div>

      {/* Suggested Users */}
      <SuggestedUsers />
    </div>
  );
};

export default RightBar;
