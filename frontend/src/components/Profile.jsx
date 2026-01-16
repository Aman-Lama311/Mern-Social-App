import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { setUserProfile } from "../redux/authSlice";

const Profile = () => {
  const { id: profileUserId } = useParams();
  useGetUserProfile(profileUserId);

  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUser = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user?._id);

  const handleFollow = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followOrUnfollow/${
          userProfile._id
        }`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // ✅ IMMUTABLE redux update
        const updatedFollowers = res.data.isFollowing
          ? [...userProfile.followers, user._id]
          : userProfile.followers.filter((id) => id !== user._id);

        dispatch(
          setUserProfile({
            ...userProfile,
            followers: updatedFollowers,
          })
        );
      }
    } catch (error) {
      toast.error("Failed to follow/unfollow user");
      console.error(error);
    }
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div className="w-full max-w-5xl flex flex-col gap-10 py-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 px-4">
          {/* Avatar */}
          <div className="flex justify-center md:w-1/3">
            <Avatar className="w-32 h-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:w-2/3 gap-4">
            {/* Username & Buttons */}
            <div className="flex items-center gap-4">
              <span className="text-2xl font-semibold">
                {userProfile?.username}
              </span>

              {isLoggedInUser ? (
                <>
                  <Link to="/account/edit">
                    <Button size="sm">Edit profile</Button>
                  </Link>
                  <Button size="sm">View archive</Button>
                </>
              ) : (
                <>
                  <Button onClick={handleFollow} size="sm">
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>

                  <Button
                    size="sm"
                    className="bg-[#0095F6] text-white hover:bg-[#0095F6]/90"
                  >
                    Message
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <p>
                <b>{userProfile?.posts?.length || 0}</b> posts
              </p>
              <p>
                <b>{userProfile?.followers?.length || 0}</b> followers
              </p>
              <p>
                <b>{userProfile?.following?.length || 0}</b> following
              </p>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <p className="font-medium">{userProfile?.bio || "bio..."}</p>
              <Badge className="w-fit gap-1">
                <AtSign className="w-4 h-4" />
                {userProfile?.username}
              </Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-800">
          <div className="flex justify-center gap-8">
            <span
              onClick={() => setActiveTab("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts"
                  ? "border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => setActiveTab("saved")}
              className={`py-3 cursor-pointer ${
                activeTab === "saved"
                  ? "border-b-2 border-white"
                  : "text-gray-400"
              }`}
            >
              SAVED
            </span>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-1">
          {displayedPost?.length ? (
            displayedPost.map((post) => (
              <div
                key={post._id}
                className="relative group aspect-square overflow-hidden"
              >
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex justify-center items-center gap-6 text-white">
                  <span className="flex items-center gap-1">
                    <FaHeart /> {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} /> {post.comments?.length || 0}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-400 py-10">
              No posts to display
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
