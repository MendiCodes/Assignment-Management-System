const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Lecturer = require("../models/Lecturer");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingLecturer = await Lecturer.findOne({ email });
    if (existingLecturer) {
      return res.status(400).json({ message: "Lecturer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const lecturer = await Lecturer.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
  console.error(err);
  res.status(500).json({
    message: "Server error",
    error: err.message
  });
}
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const lecturer = await Lecturer.findOne({ email });
    if (!lecturer) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, lecturer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: lecturer._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
