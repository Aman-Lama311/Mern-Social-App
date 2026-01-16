import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch } from "react-redux";
import { followUser } from "../redux/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const handleFollow = async (userId) => {
    // Optimistic update
    const currentFollowState = suggestedUsers.find(
      (u) => u._id === userId
    )?.isFollowing;
    dispatch(
      followUser({
        userId,
        isFollowing: !currentFollowState,
      })
    );

    try {
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/user/followOrUnfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        // rollback if failed
        dispatch(
          followUser({
            userId,
            isFollowing: currentFollowState,
          })
        );
        toast.error("Failed to follow user");
        return;
      }

      toast.success(res.data.message);
    } catch (error) {
      // rollback if error
      dispatch(
        followUser({
          userId,
          isFollowing: currentFollowState,
        })
      );
      toast.error("Failed to follow user");
      console.error("Error following user:", error);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-sm text-[#A6A6A6]">
          Suggested for you
        </h1>
        <span className="font-semibold text-xs cursor-pointer hover:underline">
          See All
        </span>
      </div>

      {/* Suggested Users */}
      <div className="space-y-3">
        {suggestedUsers?.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user._id}`}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link
                  to={`/profile/${user._id}`}
                  className="font-semibold text-sm hover:underline"
                >
                  {user?.username}
                </Link>
                <p className="text-xs text-gray-400 truncate max-w-[160px]">
                  {user?.bio || "bio..."}
                </p>
              </div>
            </div>
            <span
              onClick={() => handleFollow(user._id)}
              className={`text-sm font-semibold cursor-pointer ${
                user.isFollowing
                  ? "text-gray-400"
                  : "text-[#0095F6] hover:text-zinc-300"
              }`}
            >
              {user.isFollowing ? "Following" : "Follow"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
