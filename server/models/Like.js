import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // we do not have to put user information because we can fetch it after that
  postId: String,
  commentId: String,
});

const Like = mongoose.model("like", likeSchema);

export default Like;
