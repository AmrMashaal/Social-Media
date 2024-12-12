import express from "express";
import {
  getComments,
  deleteComment,
  likeComment,
  editComment,
  pinComment,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:postId", verifyToken, getComments);

router.delete("/:commentId", verifyToken, deleteComment);

router.patch("/:commentId/:userId/like", verifyToken, likeComment);
router.patch("/:commentId/edit", verifyToken, editComment);
router.patch("/:commentId/pin", verifyToken, pinComment);

export default router;
