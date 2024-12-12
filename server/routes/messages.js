import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getMessages, sendMessage } from "../controllers/message.js";

const router = express.Router();

router.get("/:senderId/:receiverId", verifyToken, getMessages);

export default router;
