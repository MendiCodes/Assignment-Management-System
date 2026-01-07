const express = require("express");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// STUDENT: Submit assignment WITH file
router.post(
  "/submit/:publicId",
  upload.single("file"),
  async (req, res) => {
    try {
      const { publicId } = req.params;
      const { studentName, matricNumber } = req.body;

      const assignment = await Assignment.findOne({ publicId });
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      await Submission.create({
        assignmentId: assignment._id,
        studentName,
        matricNumber,
        filePath: req.file.path
      });

      res.status(201).json({
        message: "Assignment submitted successfully"
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===============================
// LECTURER: View submissions
// ===============================
router.get(
  "/submissions/:assignmentId",
  authMiddleware,
  async (req, res) => {
    try {
      const submissions = await Submission.find({
        assignmentId: req.params.assignmentId
      });

      res.json(submissions);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ===============================
// LECTURER: Grade submission
// ===============================
router.put(
  "/submissions/:submissionId/grade",
  authMiddleware,
  async (req, res) => {
    try {
      const { score } = req.body;

      const submission = await Submission.findByIdAndUpdate(
        req.params.submissionId,
        {
          score,
          status: "Graded"
        },
        { new: true }
      );

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      res.json({
        message: "Submission graded successfully",
        submission
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Publish results (Lecturer only)
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
