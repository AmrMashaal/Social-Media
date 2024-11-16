import { v4 } from "uuid";
import Comment from "../models/Comment.js";
import sharp from "sharp";
import path from "path";

export const getComments = async (req, res) => {
  const { postId } = req.params;
  const { limit = 5, page } = req.query;

  try {
    const comments = await Comment.find({ postId: postId })
      .sort({
        createdAt: -1,
      })
      .limit(limit)
      .skip((page - 1) * limit);

    if (!comments) {
      return res.status(404).json({ message: "comments is not found" });
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const compressImage = async (buffer) => {
  return await sharp(buffer)
    .resize({ width: 800 })
    .jpeg({ quality: 80 })
    .toBuffer();
};

export const postCommentOriginal = async (req, res) => {
  const { postId, userId } = req.params;

  let picturePath = null;

  if (req.file) {
    try {
      const uniqueImageName = `${v4()}-${req.file.originalname}`;
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
    const comment = new Comment({
      userId: userId,
      postId: postId,
      picturePath,
      text: req.body.text,
      verified: req.body.verified,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userPicture: req.body.userPicture,
    });

    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comments = await Comment.findByIdAndDelete(commentId);

    if (!comments) {
      return res.status(404).json({ message: "comments is not found" });
    }

    res.status(200).json(comments);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const likeComment = async (req, res) => {
  const { commentId, userId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "comment is not found" });
    }

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((like) => like !== userId);
    } else {
      comment.likes.push(userId);
    }

    const data = await comment.save();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "comment is not found" });
    }

    comment.text = req.body.text;
    comment.edited = true;

    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
