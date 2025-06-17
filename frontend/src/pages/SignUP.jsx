import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

const SignUP = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const SignupHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          username: "",
          email: "",
          password: "",
        });
        navigate("/signin");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center px-4">
      <form
        onSubmit={SignupHandler}
        className="flex flex-col max-w-sm
      border border-gray-600 px-6 py-10"
      >
        <div className="text-center space-y-4">
          <h1 className="handwriting text-3xl">Instagram</h1>
          <p className="font-semibold text-gray-400 text-lg">
            Sign up to see photos and videos from your friends
          </p>
        </div>
        <div className="mt-2">
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={input.username}
            onChange={handleChange}
            className="my-2 py-1 focus-visible:ring-transparent outline-none"
          />
        </div>
        <div>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={input.email}
            onChange={handleChange}
            className="my-2 py-1 focus-visible:ring-transparent outline-none"
          />
        </div>
        <div>
          <Input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            value={input.password}
            className="my-2 py-1 focus-visible:ring-transparent outline-none"
          />
        </div>
        <div className="my-2 text-center space-y-4">
          <p>
            Have an account?{" "}
            <Link to="/signin" className="font-semibold text-[#4A5DF9]">
              Log in
            </Link>
          </p>
          <span>OR</span>
          {loading ? (
            <Button className="bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 w-full cursor-pointer mt-4">
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-[#4A5DF9] hover:bg-[#4A5DF9]/90 w-full cursor-pointer mt-4"
            >
              Sign up
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default SignUP;
