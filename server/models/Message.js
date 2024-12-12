import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    picturePath: String,
    text: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
