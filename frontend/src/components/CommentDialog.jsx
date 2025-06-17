import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import toast from "react-hot-toast";
import { setPosts, setSelectedPost } from "../redux/postSlice";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comments, setComments] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    setComments(selectedPost?.comments || []);
  }, [selectedPost]);

  const handleTextChange = (e) => {
    const value = e.target.value;
    if (value.trim()) {
      setText(value);
    } else {
      setText("");
    }
  };

  const handleComment = async () => {
    if (!text.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
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

        // Update Redux store
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComments } : p
        );
        dispatch(setPosts(updatedPostData));

        // Update selectedPost too if you manage it in Redux
        dispatch(
          setSelectedPost({ ...selectedPost, comments: updatedComments })
        );

        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="flex h-[60vh] max-w-7xl p-0 border-none outline-none bg-[#212328]"
      >
        {/* Left side */}
        <div className="w-1/2">
          <img
            className="w-full h-full rounded-l-lg object-cover"
            src={selectedPost?.image}
            alt="car_image"
          />
        </div>

        {/* Right side */}
        <div className="w-1/2 pr-4 flex flex-col h-full">
          {/* Post header */}
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-2 py-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={selectedPost?.author?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="text-sm font-semibold">
                {selectedPost?.author?.username}
              </h1>
            </Link>
            {/* Dialog box */}
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="flex flex-col text-center bg-[#262626] border-none outline-none p-0 w-96">
                <ul className="text-sm">
                  <li className="text-[#ED4956] font-bold cursor-pointer">
                    Unfollow
                  </li>
                  <li className="border-t border-zinc-600 cursor-pointer">
                    Add to favorites
                  </li>
                  {user?.username === selectedPost?.author?.username && (
                    <li className="border-t border-zinc-600 font-bold cursor-pointer">
                      Delete post
                    </li>
                  )}
                </ul>
              </DialogContent>
            </Dialog>
          </div>
          <hr className="border-zinc-800" />

          {/* Scrollable comments */}
          <div className="flex-1 overflow-y-auto">
            {comments?.map((comment) => (
              <Comment comment={comment} key={comment._id} />
            ))}
          </div>

          {/* Input box at the bottom */}
          <div className="border-t border-zinc-800 pt-2">
            <div className="flex items-center gap-4 justify-between">
              <input
                className="w-full outline-none border-none py-1"
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={handleTextChange}
              />
              <Button
                className="cursor-pointer bg-transparent font-medium"
                disabled={!text.trim()}
                onClick={handleComment}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CommentDialog;
