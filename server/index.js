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
import { editUser } from "./controllers/users.js";
import { verifyToken } from "./middleware/auth.js";
import { postCommentOriginal } from "./controllers/comment.js";
import { sendMessage } from "./controllers/message.js";

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
  socket.on("userOnline", (id) => {
    onlineUsers[id] = socket.id;
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find((key) => {
      return onlineUsers[key] === socket.id;
    });

    if (userId) {
      delete onlineUsers[userId];
    }
  });

  socket.on("sendMessage", (data) => {
    socket
      .to(onlineUsers[data.receivedId])
      .emit("receiveMessage", data.message);
  });

  socket.on("newPost", async (data) => {
    io.emit("notification", data);
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

// ?.updateMany(
//   {}, // No filter, so it will affect all documents
//   { $set: { ?: "" } } // Remove 'comment' field
// )
//   .then((result) => console.log("Users updated:", result))
//   .catch((err) => console.error(err));
