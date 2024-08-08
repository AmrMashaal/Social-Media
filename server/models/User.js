import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, min: 2, max: 50 },
    lastName: { type: String, required: true, min: 2, max: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8 },
    picturePath: { type: String, default: "" },
    friends: { type: Array, default: [] },
    occupation: String,
    location: String,
    impressions: Number,
    viewedProfile: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;
