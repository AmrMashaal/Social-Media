import Like from "../models/Like.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const likePost = async (req, res) => {
  const { id, userId } = req.params;

  let newPost;

  try {
    const like = await Like.findOne({ userId, postId: id });

    if (like) {
      await Like.deleteOne({ userId, postId: id });

      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { likesCount: -1 } },
        { new: true }
      );

      newPost = { ...post._doc, isLiked: false };
    } else {
      await new Like({ userId, postId: id }).save();

      const post = await Post.findByIdAndUpdate(
        id,
        { $inc: { likesCount: 1 } },
        { new: true }
      );

      newPost = { ...post._doc, isLiked: true };
    }

    res.status(200).json({ post: newPost, isLiked: !like });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeComment = async (req, res) => {
  const { id, userId } = req.params;

  let newComment;

  try {
    const like = await Like.findOne({ userId, commentId: id });

    if (like) {
      await Like.deleteOne({ userId, commentId: id });

      const comment = await Comment.findByIdAndUpdate(
        id,
        { $inc: { likesCount: -1 } },
        { new: true }
      );

      newComment = { ...comment._doc, isLiked: false };
    } else {
      await new Like({ userId, commentId: id }).save();

      const comment = await Comment.findByIdAndUpdate(
        id,
        { $inc: { likesCount: 1 } },
        { new: true }
      );

      newComment = { ...comment._doc, isLiked: true };
    }

    console.log(newComment);

    res.status(200).json({ comment: newComment, isLiked: !like }); // there is a bug here
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
