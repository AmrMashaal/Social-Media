import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    verified: { type: Boolean },
    location: String,
    description: String,
    userPicturePath: String,
    picturePath: String,
    likes: { type: Map, of: Boolean },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

export default Post;
