const express = require("express");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

const router = express.Router();

// Public results page
router.get("/results/:publicId", async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      resultsPublicId: req.params.publicId,
      resultsPublic: true
    });

    if (!assignment) {
      return res.status(404).json({ message: "Results not available" });
    }

    const submissions = await Submission.find({
      assignmentId: assignment._id
    }).select("studentName matricNumber score status");

    res.json({
      title: assignment.title,
      courseCode: assignment.courseCode,
      results: submissions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
