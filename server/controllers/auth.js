import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      occupation,
      location,
    } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwrodHash = await bcrypt.hash(password, salt);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwrodHash,
      picturePath,
      friends,
      occupation,
      location,
      impressions: Math.floor(Math.random() * 1000),
      viewedProfile: Math.floor(Math.random() * 1000),
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User is not exist." });

    const realPassword = await bcrypt.compare(password, user.password);

    if (!realPassword) {
      return res.status(400).json({ message: "Wrong password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    delete user.password;

    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
