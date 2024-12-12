import express from "express";
import { getNotification, sendNotification, watchAllNotifications,deleteAllNotifications } from "../controllers/notification.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getNotification);

router.patch("/:id", verifyToken, watchAllNotifications);

router.post("/:senderId/:receiverId", verifyToken, sendNotification);

router.delete("/:id", verifyToken, deleteAllNotifications);

export default router;
