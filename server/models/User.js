import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, min: 2, max: 20 },
    lastName: { type: String, default: "", min: 2, max: 20 },
    username: { type: String, required: true, unique: true, max: 20 },
    password: { type: String, required: true, min: 8 },
    picturePath: { type: String, default: "" },
    background: { type: String, default: "" },
    bio: { type: String, default: "" },
    friends: { type: Array, default: [] },
    friendsRequest: { type: Array, default: [] },
    verified: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    chatHistory: { type: Map, of: Object, default: {} },
    passwordChangedAt: { type: String, default: "" },
    notifications: { type: Array, default: [] },
    occupation: String,
    location: String,
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
