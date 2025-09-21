import express from "express";
import { Comment, Confession } from "../schemas.js";

const commentRoutes = express.Router();

// Fetch all comments
commentRoutes.get("/", async (_req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(201).json({
      comments,
      message: "Comments fetched successfully!",
      totalConfessions: comments.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch comments!" });
  }
});

commentRoutes.get("/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await Comment.findById(commentId);
    res.status(201).json({
      comment,
      message: "Comment fetched successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch comment!" });
  }
});

// Fetch comments on Confession
commentRoutes.get("/confession/:confessionId", async (req, res) => {
  try {
    const confessionId = req.params.confessionId;
    const comments = await Comment.find({ confessionId }).sort({
      createdAt: -1,
    });
    res.status(201).json({
      comments,
      message: `Comments from ${confessionId} fetched successfully!`,
      totalConfessions: comments.length,
    });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ error: `Failed to fetch comments from ${confessionId}` });
  }
});

// Create new confession
commentRoutes.post("/create/:confessionId", async (req, res) => {
  const confessionId = req.params.confessionId;
  const { body, author } = req.body;
  try {
    const newComment = new Comment({
      body: body,
      author: author,
      confessionId: confessionId,
    });
    await newComment.save();
    res
      .status(201)
      .json({ message: "Comment added successfully!", newComment });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to add comment!" });
  }
});

// Edit user details
commentRoutes.put("/edit/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  const { body, author } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { body, author },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found!" });
    }
    res
      .status(201)
      .json({ message: "Comment updated successfully!", updatedComment });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update comment!" });
  }
});

// Delete user from Database
commentRoutes.delete("/delete/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const deleteComment = await Comment.findByIdAndDelete(commentId);

    if (!deleteComment) {
      return res.status(404).json({ error: "Comment not found!" });
    }

    res.status(201).json({ message: "Comment deleted successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete comment!" });
  }
});

//Add like to comment
commentRoutes.put("/like/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { userId } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }
    // remove from dislikes if present
    comment.dislikes = comment.dislikes.filter(
      (uid) => uid.toString() !== userId
    );

    // toggle like
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.status(201).json({
      message: "Confession updated successfully!",
      updatedComment: comment,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update comment!" });
  }
});

// Add dislikes to comment
commentRoutes.put("/dislike/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { userId } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }

    // remove from likes if present
    comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);

    // toggle like
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      comment.dislikes.push(userId);
    }

    await comment.save();
    res.status(201).json({
      message: "Comment updated successfully!",
      updatedComment: comment,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update comment!" });
  }
});

// Add report to comment
commentRoutes.put("/report/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { userId } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found!" });
    }
    // remove from dislikes if present
    comment.likes = comment.likes.filter((uid) => uid.toString() !== userId);

    // remove from likes if present
    comment.dislikes = comment.dislikes.filter(
      (uid) => uid.toString() !== userId
    );

    // toggle like
    if (comment.reports.includes(userId)) {
      comment.reports = comment.reports.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      comment.reports.push(userId);
    }

    await comment.save();
    res.status(201).json({
      message: "Comment updated successfully!",
      updatedComment: comment,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update comment!" });
  }
});

export default commentRoutes;
