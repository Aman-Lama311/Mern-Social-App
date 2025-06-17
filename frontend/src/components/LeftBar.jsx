import {
  Compass,
  Heart,
  Home,
  LogOut,
  PlusSquare,
  Search,
  Send,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";
import { useState } from "react";

const LeftBar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/signin");
        dispatch(setAuthUser(null));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleClick = (text) => {
    if (text === "Logout") {
      handleLogout();
    } else if (text === "Create") {
      setOpen(true);
    } else if (text === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (text === "Home") {
      navigate("/");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <Compass />, text: "Explore" },
    { icon: <Send />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 w-[250px] h-screen border-r border-zinc-800 bg-black px-2 py-4 z-10">
      <h1 className="text-2xl handwriting px-4 py-5">Instagram</h1>
      <div className="flex flex-col gap-4 mt-6">
        {sidebarItems.map((item, index) => (
          <div
            onClick={() => handleClick(item.text)}
            key={index}
            className="flex items-center gap-4 hover:bg-zinc-800 px-4 py-2 rounded-md cursor-pointer"
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftBar;
