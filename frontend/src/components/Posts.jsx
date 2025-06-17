import { useSelector } from "react-redux";
import Post from "./Post";

const Posts = () => {
  const posts = useSelector((store) => store.post?.posts || []);

  // Optional: If no posts
  if (!posts.length) {
    return <p className="text-center text-gray-400">No posts yet.</p>;
  }

  return (
    <div className="space-y-4">
      {posts
        .filter((post) => post && post._id) // filter out null/undefined/invalid posts
        .map((post) => (
          <Post key={post._id} post={post} />
        ))}
    </div>
  );
};

export default Posts;
