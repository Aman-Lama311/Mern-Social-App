import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-sm font-bold">
          {comment?.author?.username}{" "}
          <span className="font-normal text-[#F5F5F5] pl-1">
            {comment?.text}
          </span>
        </h1>
      </div>
    </div>
  );
};
export default Comment;
