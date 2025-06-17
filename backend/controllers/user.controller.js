import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author && post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    // Remove null posts
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts.filter(Boolean),
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({
      _id: { $ne: req.id },
    }).select("-password");

    if (!suggestedUsers) {
      return res.status(404).json({
        message: "No suggested users found",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const followorUnfollow = async (req, res) => {
  try {
    const followgarneId = req.id;
    const jaslaiFollowgarneId = req.params.id;
    if (followgarneId === jaslaiFollowgarneId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        success: false,
      });
    }
    const user = await User.findById(followgarneId);
    const targetUser = await User.findById(jaslaiFollowgarneId);

    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    // Check if the user is already following the target user
    const isFollowing = user.following.includes(jaslaiFollowgarneId);
    if (isFollowing) {
      //unfollow the target user logic
      await Promise.all([
        User.updateOne(
          { _id: followgarneId },
          { $pull: { following: jaslaiFollowgarneId } }
        ),
        User.updateOne(
          { _id: jaslaiFollowgarneId },
          { $pull: { followers: followgarneId } }
        ),
      ]);

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      //follow the target user logic
      await Promise.all([
        User.updateOne(
          { _id: followgarneId },
          { $push: { following: jaslaiFollowgarneId } }
        ),
        User.updateOne(
          { _id: jaslaiFollowgarneId },
          { $push: { followers: followgarneId } }
        ),
      ]);

      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
