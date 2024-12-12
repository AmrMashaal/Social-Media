import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getFeedPosts,
  getUserPosts,
  deletePost,
  editPost,
  getPost,
  pinPost,
} from "../controllers/posts.js";

const router = express.Router();

router.get("/feed", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:postId", verifyToken, getPost);

router.patch("/:postId/edit", verifyToken, editPost);
router.patch("/:postId/pin", verifyToken, pinPost);

router.post("/:id/delete", verifyToken, deletePost);

export default router;
