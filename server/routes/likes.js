import express from "express";
import { likePost, likeComment } from "../controllers/likes.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.patch("/:id/:userId/like", verifyToken, likePost);
router.patch("/:id/:userId/likeComment", verifyToken, likeComment);

export default router;
