import express from "express";
import { Confession } from "../schemas.js";

const confessionRoutes = express.Router();

// Fetch all confessions
confessionRoutes.get("/", async (_req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.status(201).json({
      confessions,
      message: "Confessions fetched successfully!",
      totalConfessions: confessions.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch confessions!" });
  }
});

// Fetch all confessions
confessionRoutes.get("/trending", async (_req, res) => {
  try {
    const confessions = await Confession.find().sort({ likes: -1 });
    res.status(201).json({
      confessions,
      message: "Confessions fetched successfully!",
      totalConfessions: confessions.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch confessions!" });
  }
});

confessionRoutes.get("/hated", async (_req, res) => {
  try {
    const confessions = await Confession.find().sort({ dislikes: -1 });
    res.status(201).json({
      confessions,
      message: "Confessions fetched successfully!",
      totalConfessions: confessions.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch confessions!" });
  }
});

// Fetch confession by ID
confessionRoutes.get("/:confessionId", async (req, res) => {
  try {
    const confessionId = req.params.confessionId;
    const confession = await Confession.find({ _id: confessionId });
    if (!confession)
      return res.status(404).json({ error: "Confession not found!" });
    res.status(201).json({
      confession: confession[0],
      message: `ConfessionID: ${confessionId} fetched successfully!`,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch confession!" });
  }
});

// Create new confession
confessionRoutes.post("/create", async (req, res) => {
  const { title, body, author } = req.body;
  try {
    const newConfession = new Confession({
      title: title,
      body: body,
      author: author,
    });
    await newConfession.save();
    res
      .status(201)
      .json({ message: "Confession created successfully!", newConfession });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to create confession!" });
  }
});

// Edit confession details
confessionRoutes.put("/edit/:confessionId", async (req, res) => {
  const confessionId = req.params.confessionId;
  const { title, body, author } = req.body;
  try {
    const updatedConfession = await Confession.findByIdAndUpdate(
      confessionId,
      { title, body, author },
      { new: true }
    );
    if (!updatedConfession) {
      return res.status(404).json({ error: "Confession not found!" });
    }

    res
      .status(201)
      .json({ message: "Confession updated successfully!", updatedConfession });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update confession!" });
  }
});

// Delete confession from Database
confessionRoutes.delete("/delete/:confessionId", async (req, res) => {
  const confessionId = req.params.confessionId;
  try {
    const deletedConfession = await Confession.findByIdAndDelete(confessionId);

    if (!deletedConfession) {
      return res.status(404).json({ error: "Confession not found!" });
    }

    res.status(201).json({ message: "Confession deleted successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete confession!" });
  }
});

// Add likes to confession
confessionRoutes.put("/like/:confessionId", async (req, res) => {
  try {
    const confessionId = req.params.confessionId;
    const { userId } = req.body;
    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ error: "Confession not found!" });
    }
    // remove from dislikes if present
    confession.dislikes = confession.dislikes.filter(
      (uid) => uid.toString() !== userId
    );

    // toggle like
    if (confession.likes.includes(userId)) {
      confession.likes = confession.likes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      confession.likes.push(userId);
    }

    await confession.save();
    res.status(201).json({
      message: "Confession updated successfully!",
      updatedConfession: confession,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update confession!" });
  }
});

// Add dislikes to confession
confessionRoutes.put("/dislike/:confessionId", async (req, res) => {
  try {
    const confessionId = req.params.confessionId;
    const { userId } = req.body;
    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ error: "Confession not found!" });
    }

    // remove from likes if present
    confession.likes = confession.likes.filter(
      (uid) => uid.toString() !== userId
    );

    // toggle like
    if (confession.dislikes.includes(userId)) {
      confession.dislikes = confession.dislikes.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      confession.dislikes.push(userId);
    }

    await confession.save();
    res.status(201).json({
      message: "Confession updated successfully!",
      updatedConfession: confession,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update confession!" });
  }
});

// Add report to confession
confessionRoutes.put("/report/:confessionId", async (req, res) => {
  try {
    const confessionId = req.params.confessionId;
    const { userId } = req.body;
    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ error: "Confession not found!" });
    }
    // remove from dislikes if present
    confession.likes = confession.likes.filter(
      (uid) => uid.toString() !== userId
    );

    // remove from likes if present
    confession.dislikes = confession.dislikes.filter(
      (uid) => uid.toString() !== userId
    );

    // toggle like
    if (confession.reports.includes(userId)) {
      confession.reports = confession.reports.filter(
        (uid) => uid.toString() !== userId
      );
    } else {
      confession.reports.push(userId);
    }

    await confession.save();
    res.status(201).json({
      message: "Confession updated successfully!",
      updatedConfession: confession,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update confession!" });
  }
});

export default confessionRoutes;
