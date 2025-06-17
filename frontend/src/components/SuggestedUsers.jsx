import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div>
      <div className="flex justify-between items-baseline">
        <h1 className="font-semibold text-sm text-[#A6A6A6] ">
          Suggested for you
        </h1>
        <span className="font-semibold text-xs cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.map((user) => (
        <div key={user._id}>
          <div className="flex items-center gap-2 py-1 mt-2">
            <Link className="w-8 h-8" to={`/profile/${user?._id}`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center">
              <div>
                <Link
                  to={`/profile/${user?._id}`}
                  className="font-semibold text-sm"
                >
                  {user?.username}
                </Link>
                <p className="text-sm font-normal text-[#A6A6A6]">
                  {user?.bio || "bio..."}
                </p>
              </div>
              <span className="absolute right-0 font-semibold text-[#0095F6] hover:text-zinc-300 text-sm cursor-pointer">
                Follow
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SuggestedUsers;
