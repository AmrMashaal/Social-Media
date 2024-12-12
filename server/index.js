import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Server } from "socket.io";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js";
import commentRoutes from "./routes/comments.js";
import searchRoutes from "./routes/search.js";
import notificationRoutes from "./routes/notifications.js";
import { editUser } from "./controllers/users.js";
import { verifyToken } from "./middleware/auth.js";
import { postCommentOriginal } from "./controllers/comment.js";
import { sendMessage } from "./controllers/message.js";
import likeRoutes from "./routes/likes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const server = http.createServer(app);

const PORT = process.env.PORT || 6001;

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_LINK,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("userOnline", async (data) => {
    onlineUsers[data.userId] = socket.id;

    for (const friend in data.friends) {
      socket
        .to(onlineUsers[data.friends[friend]._id])
        .emit("friendsOnline", data.userId);
    }

    const response = await fetch(
      `${process.env.FRONTEND_FETCHING_LINK}/users/${data.userId}/onlineState`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          makeOnline: true,
        }),
      }
    );
  });

  // --------------------------------------------------------

  socket.on("sendMessage", (data) => {
    socket
      .to(onlineUsers[data.receivedId])
      .emit("receiveMessage", data.message);
  });

  // --------------------------------------------------------

  socket.on("newPost", async (data) => {
    io.emit("notification", data);
  });

  // --------------------------------------------------------

  socket.on("notifications", async (data) => {
    if (data.notification.type !== "newPost") {
      socket
        .to(onlineUsers[data.receiverId])
        .emit("getNotifications", data.notification);
    }
    // ------------------------------------------------------
    else if (data.notification.type === "newPost") {
      for (const friend in data.friends) {
        const response = await fetch(
          `${process.env.FRONTEND_FETCHING_LINK}/notifications/${data._id}/${data.friends[friend]._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },

            body: JSON.stringify({
              type: "newPost",
              description: `${data.firstName} shared a new post`,
              linkId: data.postId,
              receiverId: data.friends[friend]._id,
              senderId: data._id,
            }),
          }
        );

        const notification = await response.json();

        socket
          .to(onlineUsers[data.friends[friend]._id])
          .emit("friendNewPost", notification);
      }
    }
  });

  // --------------------------------------------------------

  socket.on("disconnect", async () => {
    const userId = Object.keys(onlineUsers).find((key) => {
      return onlineUsers[key] === socket.id;
    });

    if (userId) {
      delete onlineUsers[userId];
    }

    await fetch(
      `${process.env.FRONTEND_FETCHING_LINK}/users/${userId}/onlineState`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          makeOnline: false,
        }),
      }
    );
  });
});

const compressImage = async (buffer) => {
  return sharp(buffer)
    .resize(1000) // Resize the image
    .jpeg({ quality: 70 }) // Compress the image
    .toBuffer(); // Return the processed image as a buffer
};

const uploadAndCompress = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const compressedBuffer = await compressImage(req.file.buffer);
    const filePath = path.join(
      __dirname,
      "public/assets",
      req.file.originalname
    );
    await sharp(compressedBuffer).toFile(filePath);

    req.file.path = filePath; // Update the file path
    next(); // Proceed to the next step
  } catch (err) {
    console.error("Image compression error:", err);
    res.status(500).json({ message: "Image compression failed" });
  }
};

app.patch(
  "/users/:id/:usernameParam/edit",
  verifyToken,
  upload.single("picture"),
  uploadAndCompress,
  editUser
);

app.post(
  "/auth/register",
  upload.single("picture"),
  uploadAndCompress,
  register
);

app.post("/posts", verifyToken, upload.single("picture"), createPost);

app.post(
  "/comments/:userId/:postId",
  verifyToken,
  upload.single("picture"),
  uploadAndCompress,
  postCommentOriginal
);

app.post(
  "/messages/:senderId/:receiverId",
  verifyToken,
  upload.single("picture"),
  uploadAndCompress,
  sendMessage
);

app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/messages", messageRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/likes", likeRoutes);

const serverConnection = async () => {
  try {
    mongoose.connect(process.env.MONGODB_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

serverConnection();

// ?.updateMany({}, { $set: { ?: 0 } })
// .then((result) => console.log("Users updated:", result))
// .catch((err) => console.error(err));
