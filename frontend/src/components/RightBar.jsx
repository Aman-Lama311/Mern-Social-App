import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="absolute top-0 right-0 w-[20%] my-10 mr-[5%] hidden lg:block">
      <div className="flex items-center gap-2 py-3">
        <Link to={`/profile/${user?._id}`} className="w-10 h-10">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-white text-sm">
                CN
              </div>
            )}
          </div>
        </Link>
        <div>
          <Link to={`/profile/${user?._id}`} className="font-semibold text-sm">
            {user?.username}
          </Link>
          <p className="text-sm font-normal text-[#A6A6A6]">
            {user?.bio || "bio..."}
          </p>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightBar;
