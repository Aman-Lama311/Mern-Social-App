import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setAuthUser } from "../redux/authSlice";
import axios from "axios";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: null,
    bio: user?.bio || "",
    gender: user?.gender || "",
  });

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput((prev) => ({
        ...prev,
        profilePhoto: file,
      }));
    }
  };

  const selectChangeHandler = (value) => {
    setInput((prev) => ({ ...prev, gender: value }));
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);

    if (input.profilePhoto instanceof File) {
      formData.append("profilePicture", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/profile/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture,
        };

        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-10 py-8">
      <section className="w-full max-w-2xl flex flex-col gap-6">
        <h1 className="font-bold text-2xl text-center sm:text-left">
          Edit Profile
        </h1>

        {/* Change Photo Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 p-4 bg-zinc-800 rounded-md">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">{user?.username}</h1>
              <span className="text-sm text-gray-400">
                {user?.bio || "bio..."}
              </span>
            </div>
          </div>
          <div className="w-full sm:w-auto text-center">
            <input
              onChange={fileChangeHandler}
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="cursor-pointer w-full sm:w-auto"
            >
              Change Photo
            </Button>
          </div>
        </div>

        {/* Bio Input */}
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="focus-visible:ring-transparent min-h-[100px]"
            placeholder="Write something about yourself..."
          />
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#1f1f1f] text-white">
              <SelectGroup>
                <SelectLabel>Gender</SelectLabel>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={editProfileHandler}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
