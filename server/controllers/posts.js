import sharp from "sharp";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import Notification from "../models/notification.js";

const compressImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 800 })
    .jpeg({ quality: 80 })
    .toBuffer();
};

export const createPost = async (req, res) => {
  let picturePath = null;

  if (req.file) {
    try {
      const uniqueImageName = `${uuidv4()}-${req.file.originalname}`;
      const compressedBuffer = await compressImage(req.file.buffer);
      const filePath = path.join(
        process.cwd(),
        "public/assets",
        uniqueImageName
      );

      // Save the compressed image to the file system
      await sharp(compressedBuffer).toFile(filePath);
      req.file.path = filePath; // Update file path for potential future use
      picturePath = uniqueImageName;
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  try {
    // Destructure and set post details
    const { userId, description } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      description,
      picturePath,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      location: user.location,
      verified: user.verified,
      comments: [],
      likes: [],
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Image compression or post creation error:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getFeedPosts = async (req, res) => {
  const { page, limit = 5 } = req.query;
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const postsWithIsLiked = await Promise.all(
      posts.map(async (post) => {
        const isLiked = await Like.findOne({
          userId: req.user.id,
          postId: post._id,
        });

        return { ...post._doc, isLiked: Boolean(isLiked) };
      })
    );

    res.status(200).json(postsWithIsLiked);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  const { page, limit = 5 } = req.query;
  const { userId } = req.params;

  try {
    const userPosts = await Post.find({ userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ pinned: -1, createdAt: -1 });

    const postsWithIsLiked = await Promise.all(
      userPosts.map(async (post) => {
        const isLiked = await Like.findOne({
          userId: req.user.id,
          postId: post._id,
        });

        return { ...post._doc, isLiked: Boolean(isLiked) };
      })
    );

    res.status(200).json(postsWithIsLiked);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }

    const isLiked = await Like.findOne({
      userId: req.user.id,
      postId: post._id,
    });

    const postWithIsLiked = { ...post._doc, isLiked: Boolean(isLiked) };

    res.status(200).json(postWithIsLiked);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.deleteMany({ linkId: id });

    await Comment.deleteMany({ postId: id });

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post is not found" });
    }

    res.status(200).json(deletedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "Post is not found" });
  }

  try {
    post.description = req.body.description;
    post.edited = true;

    const result = await post.save();

    const isLiked = await Like.findOne({
      userId: req.user.id,
      postId: post._id,
    });

    const postWithIsLiked = { ...result._doc, isLiked: Boolean(isLiked) };

    res.status(200).json(postWithIsLiked);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const pinPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }

    if (post.pinned) {
      post.pinned = false;
    } else {
      post.pinned = true;
    }

    await post.save();

    const isLiked = await Like.findOne({
      userId: req.user.id,
      postId: post._id,
    });

    const postWithIsLiked = { ...post._doc, isLiked: Boolean(isLiked) };

    res.status(200).json(postWithIsLiked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
