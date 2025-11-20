import express from "express";
import dotenv from "dotenv";
import authRoutes from "./Routes/auth.routes.js";
import userRoutes from "./Routes/user.routes.js";
import chatRoutes from "./Routes/chat.routes.js";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, //allow frontend to send cookies
  })
);

// routes for authentication
app.use("/api/auth", authRoutes);

// routes for Users
app.use("/api/user", userRoutes);

// routes for chats
app.use("/api/chat", chatRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(_dirname, "../frontend/dist")));
// }

// app.get("*", (req, res) => {
//   res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}`);
  connectDb();
});
