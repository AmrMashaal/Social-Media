import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userPicture: { type: String, default: "" },
    verified: { type: Boolean, defualt: false },
    userId: { type: String, required: true },
    edited: { type: Boolean, default: false },
    likes: { type: Array, default: [] },
    text: { type: String, max: 300, default: "" },
    picturePath: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
