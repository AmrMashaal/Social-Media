import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true },
    firstName: { type: String, required: true },
    userPicture: { type: String, default: "" },
    verified: { type: Boolean, defualt: false },
    userId: { type: String, required: true },
    edited: { type: Boolean, default: false },
    text: { type: String, max: 300, default: "" },
    likesCount: { type: Number, default: 0 },
    pinned: { type: Boolean, default: false },
    lastName: String,
    picturePath: String,
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
