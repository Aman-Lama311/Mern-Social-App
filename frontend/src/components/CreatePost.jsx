import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { readFileAsdataUrl } from "../lib/utils";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsdataUrl(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // Refetching all posts after creation
        const getRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/post/all`,
          {
            withCredentials: true,
          }
        );
        if (getRes.data.success) {
          dispatch(setPosts(getRes.data.posts));
        }

        toast.success(res.data.message);
        setCaption("");
        setImagePreview("");
        setFile("");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent
        className={"bg-[#262626] border-none outline-none"}
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className={"text-white font-semibold mx-auto"}>
          Create New Post
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              className={"w-10 h-10"}
              src={user?.profilePicture}
              alt="image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
            <span className="text-sm text-[#8e8e8e]">Bio here ...</span>
          </div>
        </div>
        <Textarea
          type="text"
          placeholder="Write a caption..."
          className={"focus-visible:ring-0"}
          value={caption}
          onChange={(e) => setCaption(e.target.value)} // ✅ Add this
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="image_preview"
            className="w-full h-64 object-cover"
          />
        )}
        <input
          ref={imageRef}
          onChange={fileChangeHandler}
          type="file"
          className="hidden"
        />
        <Button
          onClick={() => imageRef.current.click()}
          className={
            "w-fit mx-auto bg-[#0095F6] hover:bg-[#0094f6e3] cursor-pointer"
          }
        >
          Select From Computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="animate-spin" />
              <span className="ml-2">Posting...</span>
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className={"cursor-pointer"}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};
export default CreatePost;
