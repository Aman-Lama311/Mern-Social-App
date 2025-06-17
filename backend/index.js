import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { urlencoded } from "express";
import connectDB from "./utils/dataBase.js";
import userRoutes from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

dotenv.config();

const app = express();

// Test route
app.get("/", (_, res) => {
  return res.status(200).json("Welcome to the backend server!");
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://mern-social-app-iota.vercel.app", // ❌ remove trailing slash
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ allow preflight
    credentials: true,
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

// Start server after DB is connected
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Await database connection first
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error);
    process.exit(1); // stop server if DB connection fails
  }
};

startServer();
