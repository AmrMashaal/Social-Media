import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  editPost,
  getPost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/feed", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:postId", verifyToken, getPost);
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/delete", verifyToken, deletePost);
router.patch("/:postId/edit", verifyToken, editPost);

export default router;
