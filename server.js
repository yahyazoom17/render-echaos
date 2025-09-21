import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDB } from "./database.js";
import commentRoutes from "./routes/comment.js";
import confessionRoutes from "./routes/confession.js";
import userRoutes from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Connect to MongoDB Atlas
connectToDB();

// API routes
app.get("/api", (_req, res) => {
  res.send("Echaos API v0.1 Running...");
});

// User Routes
app.use("/api/users", userRoutes);

// Confession Routes
app.use("/api/confessions", confessionRoutes);

// Comment Routes
app.use("/api/comments", commentRoutes);

app.listen(port, () => {
  console.log(`EChaoes API v0.1`);
  console.log(`Server is running on http://localhost:${port}`);
});
