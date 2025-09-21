import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    confessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Confession",
      required: true,
    },
    likes: [{ type: String, ref: "User" }],
    dislikes: [{ type: String, ref: "User" }],
    reports: [{ type: String, ref: "User" }],
  },
  { timestamps: true }
);

const confessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    likes: [{ type: String, ref: "User" }],
    dislikes: [{ type: String, ref: "User" }],
    reports: [{ type: String, ref: "User" }],
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    userId: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const Comment = new mongoose.model("Comment", commentSchema);
export const Confession = new mongoose.model("Confession", confessionSchema);
export const User = new mongoose.model("User", userSchema);
