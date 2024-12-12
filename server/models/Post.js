import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: String,
    verified: { type: Boolean, defualt: false },
    edited: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    location: String,
    description: String,
    userPicturePath: String,
    picturePath: String,
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

export default Post;
