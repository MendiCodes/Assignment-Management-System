const express = require("express");
const Assignment = require("../models/Assignment");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("crypto");

const router = express.Router();

// Create assignment (Lecturer only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, courseCode, deadline } = req.body;

    const publicId = crypto.randomBytes(6).toString("hex");

    const assignment = await Assignment.create({
      title,
      courseCode,
      deadline,
      lecturerId: req.lecturerId,
      publicId
    });

    res.status(201).json({
      message: "Assignment created",
      assignmentLink: `http://localhost:5000/submit/${publicId}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get lecturer assignments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      lecturerId: req.lecturerId
    });

    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.put(
  "/:assignmentId/publish-results",
  authMiddleware,
  async (req, res) => {
    try {
      const assignment = await Assignment.findById(req.params.assignmentId);

      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      assignment.resultsPublic = true;
      assignment.resultsPublicId =
        assignment.resultsPublicId ||
        require("crypto").randomBytes(6).toString("hex");

      await assignment.save();

      res.json({
        message: "Results published",
        resultsLink: `http://localhost:5000/results/${assignment.resultsPublicId}`
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
