import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    //image upload logic
    const uptimizeImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${uptimizeImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "post created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username profilePicture" },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeGarneUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Prevent duplicate likes
    if (post.likes.includes(likeGarneUserId)) {
      return res.status(400).json({
        message: "You already liked this post",
        success: false,
      });
    }

    // Add like
    post.likes.push(likeGarneUserId);
    await post.save();

    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {
    console.log("Like Error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({
        message: "You haven't liked this post yet",
        success: false,
      });
    }

    post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    await post.save();

    res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log("Dislike Error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentGarneUserId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Text is required",
        success: false,
      });
    }

    const comment = await Comment.create({
      text,
      author: commentGarneUserId,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "Comment added successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
      .populate({ path: "author", select: "username profilePicture" })
      .sort({ createdAt: -1 });

    if (!comments) {
      return res.status(404).json({
        message: "Comments not found",
        success: false,
      });
    }
    return res.status(200).json({
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Check if the user is the author of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);
    // Remove the post reference from the author's posts
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    // Optionally, delete all comments associated with the post
    await Comment.deleteMany({ post: postId });
    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    const user = await User.findById(authorId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.bookmarks.includes(post._id)) {
      // Remove the post from bookmarks
      user.bookmarks.pull(post._id);
      await user.save();

      return res.status(200).json({
        message: "Post removed from bookmarks",
        type: "unsaved",
        success: true,
      });
    } else {
      // Add the post to bookmarks
      user.bookmarks.addToSet(post._id); // prevents duplicates
      await user.save();

      return res.status(200).json({
        message: "Post bookmarked successfully",
        type: "saved",
        success: true,
      });
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
