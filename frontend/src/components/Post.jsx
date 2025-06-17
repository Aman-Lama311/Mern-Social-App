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
    if (value.trim()) {
      setText(value);
    } else {
      setText("");
    }
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

        // Update the post in the Redux store
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
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedComments = [...comments, res.data.comment];
        setComments(updatedComments);

        // Update the post in the Redux store
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
        const updatedPosts = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
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
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border-b border-zinc-800 py-2">
      {/* Post header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 py-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={post.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-baseline gap-2">
            <h1>{post.author?.username}</h1>
            {user && user?._id === post?.author._id && <Badge>Author</Badge>}
          </div>
        </div>
        {/* Dialog box */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent
            className={
              "flex flex-col text-center bg-[#262626] border-none outline-none p-0 w-96"
            }
          >
            <ul className="text-sm">
              <li className="text-[#ED4956] font-bold">Unfollow</li>
              <li className="border-t border-zinc-600">Add to favorites</li>
              {user && user?._id === post?.author._id && (
                <li
                  onClick={deletePostHandler}
                  className="border-t border-zinc-600 "
                >
                  Delete post
                </li>
              )}
            </ul>
          </DialogContent>
        </Dialog>
      </div>
      {/* Post image */}
      <img
        className="rounded aspect-square object-cover w-full"
        src={post.image}
        alt="car_image"
      />
      {/* Post footer likes comments and share */}

      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikePostHandler}
              size={24}
              className="cursor-pointer text-[#FF3040]"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikePostHandler}
              size={24}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-[#808080]"
          />
          <Send className="cursor-pointer hover:text-[#808080]" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-[#808080]"
        />
      </div>
      <span className="font-medium text-sm block mb-3">{postLikes} likes</span>
      <p className="space-x-2 text-sm font-medium">
        <strong>{post.author?.username}</strong>
        <span>{post.caption}</span>
      </p>
      {comments.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-sm  text-[#808080] cursor-pointer"
        >
          View all {comments.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      {/* comment input */}
      <div className="flex items-center gap-2 py-2">
        <input
          className="text-sm outline-none w-full"
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Add a comment..."
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-sm font-medium cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};
export default Post;
