import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  acceptFriend,
  refuseFriend,
  getChatHistory,
  modifyChatHistory,
  changePassword,
  checkCorrectPassword,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:id/chatHistory", verifyToken, getChatHistory);

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id/:friendId/accept", verifyToken, acceptFriend);
router.patch("/:id/:friendId/refuse", verifyToken, refuseFriend);
router.patch("/:id/:receivedId/chatHistory", verifyToken, modifyChatHistory);

router.post("/:id/password", verifyToken, changePassword);
router.post("/:id/checkCorrectPassword", verifyToken, checkCorrectPassword);

export default router;
