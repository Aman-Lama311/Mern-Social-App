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
      formData.append("profilePicture", input.profilePhoto); // correct field name
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
    <div className="flex max-w-2xl my-10 mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        {/* Change photo */}
        <div className="flex items-center justify-between p-2 bg-zinc-800 rounded-md">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage className="w-10 h-10" src={user?.profilePicture} />
              <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1>{user?.username}</h1>
              <span>{user?.bio || "bio..."}</span>
            </div>
          </div>
          <div>
            <input
              onChange={fileChangeHandler}
              ref={imageRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="cursor-pointer"
            >
              Change Photo
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h1 className="font-semibold text-lg mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) =>
              setInput((prev) => ({ ...prev, bio: e.target.value }))
            }
            className="focus-visible:ring-transparent"
          />
        </div>

        {/* Gender */}
        <div>
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            onClick={editProfileHandler}
            className="cursor-pointer"
            disabled={loading}
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
