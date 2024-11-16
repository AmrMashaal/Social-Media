import sharp from "sharp";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import Post from "../models/Post.js";
import User from "../models/User.js";

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
      likes: {},
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

    res.status(200).json(posts);
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
      .sort({ createdAt: -1 });

    res.status(200).json(userPosts);
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

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    if (!post) {
      return res.status(404).json({ message: "Post is not found" });
    }

    const uodatedPost = await Post.findByIdAndUpdate(
      id,
      {
        likes: post.likes,
      },
      { new: true } // we used it to show us the updated post because without it. it will show us the old post even after updating it
    );
    res.status(200).json(uodatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post is not found" });
    }

    await Comment.deleteMany({ postId: id });

    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const postComment = async (req, res) => {
  const { postId, userId } = req.params;
  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).send({ message: "Post is not found" });
  }

  try {
    post.comments.push({
      _id: req.body._id,
      text: req.body.text,
      img: req.body.img || null,
      userId: userId,
      userImage: req.body.userImage,
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      verified: req.body.verified,
      likes: [],
      replays: [],
      createdAt: req.body.createdAt,
    });

    const result = await post.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
