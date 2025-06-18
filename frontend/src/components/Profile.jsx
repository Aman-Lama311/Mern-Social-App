import { Link, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, MessageCircle } from "lucide-react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLogedInUser = user?._id === userProfile?._id;
  const isFollowing = true;

  const handleTabChnage = (tab) => {
    setActiveTab(tab);
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
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePhoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex flex-col md:w-2/3 gap-4">
            {/* Username and buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-xl sm:text-2xl font-semibold">
                {userProfile?.username}
              </span>
              {isLogedInUser ? (
                <>
                  <Link to="/account/edit">
                    <Button size="sm">Edit profile</Button>
                  </Link>
                  <Button size="sm">View archive</Button>
                </>
              ) : isFollowing ? (
                <>
                  <Button size="sm">Unfollow</Button>
                  <Button
                    size="sm"
                    className="bg-[#0095F6] text-white hover:bg-[#0095F6]/90"
                  >
                    Message
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  className="bg-[#0095F6] text-white hover:bg-[#0095F6]/90"
                >
                  Message
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-5 text-sm sm:text-base">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts?.length || 0}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followers?.length || 0}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.following?.length || 0}
                </span>{" "}
                following
              </p>
            </div>

            {/* Bio and Info */}
            <div className="flex flex-col gap-1">
              <p className="font-medium">{userProfile?.bio || "bio..."}</p>
              <Badge className="w-fit gap-1">
                <AtSign className="w-4 h-4" />
                {userProfile?.username}
              </Badge>
              <span className="text-sm">🧑‍🏫Learning fullstack development</span>
              <span className="text-sm">🧑‍💻 Building side projects</span>
              <span className="text-sm">🌱 Improving daily</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-zinc-800">
          <div className="flex justify-center gap-8 text-sm sm:text-base">
            <span
              onClick={() => handleTabChnage("posts")}
              className={`py-3 px-2 sm:px-4 cursor-pointer ${
                activeTab === "posts"
                  ? "border-b-2 border-white font-medium"
                  : "text-gray-400"
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => handleTabChnage("saved")}
              className={`py-3 px-2 sm:px-4 cursor-pointer ${
                activeTab === "saved"
                  ? "border-b-2 border-white font-medium"
                  : "text-gray-400"
              }`}
            >
              SAVED
            </span>
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 px-2 sm:px-0">
          {displayedPost?.length > 0 ? (
            displayedPost.map((post) => (
              <div
                key={post._id}
                className="relative group cursor-pointer aspect-square overflow-hidden"
              >
                <img
                  src={post?.image}
                  alt="post"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex items-center gap-4 text-white">
                    <Button className="bg-transparent text-white hover:bg-transparent flex items-center gap-1">
                      <FaHeart />
                      <span>{post?.likes?.length || 0}</span>
                    </Button>
                    <Button className="bg-transparent text-white hover:bg-transparent flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post?.comments?.length || 0}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2 sm:col-span-3 text-gray-400 py-10">
              No posts to display
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
