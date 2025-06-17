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
  console.log(userProfile);

  const isLogedInUser = user?._id === userProfile?._id;
  const isFollowing = true;

  const handleTabChnage = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-[10%]">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className={"w-32 h-32"}>
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePhoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="text-nowrap">{userProfile?.username}</span>
                {isLogedInUser ? (
                  <>
                    <Link to="/account/edit">
                      <Button>Edit profile</Button>
                    </Link>
                    <Button>View archive</Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button>Unfollow</Button>
                    <Button
                      className={
                        "bg-[#0095F6] text-white hover:bg-[#0095F6]/90"
                      }
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    className={"bg-[#0095F6] text-white hover:bg-[#0095F6]/90"}
                  >
                    Message
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-5">
                <p>
                  {userProfile?.posts.length}{" "}
                  <span className="font-semibold text-gray-300">posts</span>
                </p>
                <p>
                  {userProfile?.followers.length}{" "}
                  <span className="font-semibold text-gray-300">Followers</span>
                </p>
                <p>
                  {userProfile?.following.length}{" "}
                  <span className="font-semibold text-gray-300">Following</span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">{userProfile?.bio || "bio..."}</p>
                <Badge>
                  <AtSign />
                  {userProfile?.username}
                </Badge>
                <span>🧑‍🏫Learning fullstack development</span>
                <span>🧑‍🏫Learning fullstack development</span>
                <span>🧑‍🏫Learning fullstack development</span>
              </div>
            </div>
          </section>
        </div>
        {/* posts */}
        <div className="border-t border-zinc-800">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              onClick={() => handleTabChnage("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "border-b-2 border-zinc-800" : ""
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => handleTabChnage("saved")}
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "border-b-2 border-zinc-800" : ""
              }`}
            >
              SAVED
            </span>
          </div>
          {/* displayed posts */}
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => (
              <div key={post._id} className="relative group cursor-pointer">
                <img
                  src={post?.image}
                  alt="postImage"
                  className="rounded my-2 w-full aspect-square object-cover"
                />
                <div className="rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-200 absolute">
                  <div className="flex items-center text-white space-x-4">
                    <Button
                      className={"flex items-center bg-transparent gap-1"}
                    >
                      <FaHeart />
                      <span>{post?.likes.length}</span>
                    </Button>
                    <Button
                      className={"flex items-center bg-transparent gap-1"}
                    >
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
