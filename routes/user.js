import express from "express";
import { Comment, Confession, User } from "../schemas.js";

const userRoutes = express.Router();

// Fetch all users
userRoutes.get("/", async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(201).json({
      users,
      message: "Users fetched successfully!",
      totalUsers: users.length,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to fetch users!" });
  }
});

// Get user by Id
userRoutes.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.find({ userId });
    if (!user) res.status(404).json({ error: `User ${userId} not found!` });
    res.status(201).json({
      user: user[0],
      message: `User ${user[0].userName}(${userId}) fetched successfully!`,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: `Failed to fetch user ${userId}!` });
  }
});

// Get user by Name
userRoutes.get("/details/:userName", async (req, res) => {
  try {
    const userName = req.params.userName;
    const confessions = await Confession.find({ author: userName });
    if (!confessions)
      res.status(404).json({ error: `${userName} confessions not found!` });
    const comments = await Comment.find({ author: userName });
    if (!comments)
      res.status(404).json({ error: `${userName} comments not found!` });
    res.status(201).json({
      confessions,
      comments,
      message: `User ${userName} details fetched successfully!`,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: `Failed to fetch user ${userName}!` });
  }
});

// Create new user
userRoutes.post("/create", async (req, res) => {
  const { userId } = req.body;
  try {
    const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const color = [
      "Black",
      "Red",
      "Orange",
      "White",
      "Pink",
      "Green",
      "Blue",
      "Yellow",
      "Brown",
      "Purple",
    ];
    const animal = [
      "Lion",
      "Monkey",
      "Elephant",
      "Tiger",
      "Giraffe",
      "Goat",
      "Panda",
      "Rakoon",
      "Fox",
      "Crocodile",
    ];
    const randomOneNumber = Math.floor(Math.random() * number.length);
    const randomTwoNumber = Math.floor(Math.random() * number.length);
    const randomColor = Math.floor(Math.random() * color.length);
    const randomAnimal = Math.floor(Math.random() * animal.length);
    const userName =
      color[randomColor] +
      animal[randomAnimal] +
      number[randomOneNumber] +
      number[randomTwoNumber];
    console.log(userName);
    const newUser = new User({
      userId,
      userName,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: `User ${userName} created successfully!`, newUser });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to create user!" });
  }
});

// Edit user details
userRoutes.put("/edit/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { name, confessions } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, confessions },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    res
      .status(201)
      .json({ message: "User updated successfully!", updatedUser });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to update user!" });
  }
});

// Delete user from Database
userRoutes.delete("/delete/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.status(201).json({ message: "User deleted successfully!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Failed to delete user!" });
  }
});

export default userRoutes;
