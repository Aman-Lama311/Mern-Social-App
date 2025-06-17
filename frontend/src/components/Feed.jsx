import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="flex-1 flex flex-col items-center w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6">
      <Posts />
    </div>
  );
};

export default Feed;
