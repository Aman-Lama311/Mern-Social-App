import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [postLikes, setPostLikes] = useState(post?.likes?.length);
  const [comments, setComments] = useState(post?.comments);
  const dispatch = useDispatch();

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value.trim() ? value : "");
  };

  const likeOrDislikePostHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${
          post?._id
        }/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLikes - 1 : postLikes + 1;
        setPostLikes(updatedLikes);
        setLiked(!liked);
        const updatedPostsData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostsData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPosts = posts.filter((item) => item?._id !== post?._id);
        dispatch(setPosts(updatedPosts));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto border-b border-zinc-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm sm:text-base font-semibold">
              {post.author?.username}
            </h1>
            {user && user?._id === post?.author._id && (
              <Badge className="text-xs">Author</Badge>
            )}
          </div>
        </div>
        {/* Options */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer hover:text-gray-400" />
          </DialogTrigger>
          <DialogContent className="flex flex-col bg-[#262626] border-none outline-none p-0 w-full sm:w-96 text-sm">
            <ul>
              <li className="text-[#ED4956] font-bold cursor-pointer py-2">
                Unfollow
              </li>
              <li className="border-t border-zinc-600 py-2">
                Add to favorites
              </li>
              {user && user?._id === post?.author._id && (
                <li
                  onClick={deletePostHandler}
                  className="border-t border-zinc-600 py-2 cursor-pointer text-red-500"
                >
                  Delete post
                </li>
              )}
            </ul>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post image */}
      <div className="mt-3">
        <img
          src={post.image}
          alt="post_img"
          className="w-full object-cover rounded-md aspect-square"
        />
      </div>

      {/* Footer - Like, Comment, Share */}
      <div className="flex items-center justify-between py-3">
        <div className="flex gap-4 items-center">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikePostHandler}
              size={22}
              className="text-[#FF3040] cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikePostHandler}
              size={22}
              className="hover:text-gray-600 cursor-pointer"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-500"
          />
          <Send className="cursor-pointer hover:text-gray-500" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-500"
        />
      </div>

      {/* Likes count */}
      <p className="text-sm font-semibold mb-1">{postLikes} likes</p>

      {/* Caption */}
      <p className="text-sm mb-1">
        <strong>{post.author?.username}</strong>{" "}
        <span className="text-gray-300">{post.caption}</span>
      </p>

      {/* View Comments */}
      {comments.length > 0 && (
        <p
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-sm text-gray-400 cursor-pointer"
        >
          View all {comments.length} comments
        </p>
      )}

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Comment input */}
      <div className="flex items-center gap-3 mt-3">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Add a comment..."
          className="flex-1 text-sm bg-transparent focus:outline-none"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-sm text-blue-500 font-medium cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
