import {
  Compass,
  Heart,
  Home,
  LogOut,
  PlusSquare,
  Search,
  Send,
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
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
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
    if (text === "Logout") handleLogout();
    else if (text === "Create") setOpen(true);
    else if (text === "Profile") navigate(`/profile/${user?._id}`);
    else if (text === "Home") navigate("/");
  };

  const sidebarItems = [
    { icon: <Home size={24} />, text: "Home" },
    { icon: <Search size={24} />, text: "Search" },
    { icon: <Compass size={24} />, text: "Explore" },
    { icon: <Send size={24} />, text: "Messages" },
    { icon: <Heart size={24} />, text: "Notifications" },
    { icon: <PlusSquare size={24} />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut size={24} />, text: "Logout" },
  ];

  return (
    <>
      {/* Sidebar for md and up */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen max-w-[250px] px-4 py-6 border-r border-zinc-800 bg-black z-10 flex-col justify-between">
        <div>
          <h1 className="text-2xl handwriting px-2 py-4 mb-6">Instagram</h1>
          <div className="flex flex-col gap-4">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleClick(item.text)}
                className="flex items-center gap-4 hover:bg-zinc-800 px-3 py-2 rounded-md cursor-pointer"
              >
                <span>{item.icon}</span>
                {/* Hide text on 2xl+ */}
                <span className="hidden 2xl:inline">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <div className="md:hidden fixed bottom-0 w-full bg-black border-t border-zinc-800 z-20">
        <div className="flex justify-around items-center h-14">
          {sidebarItems.slice(0, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item.text)}
              className="flex flex-col items-center justify-center cursor-pointer hover:text-zinc-300"
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftBar;
