const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  assignmentId: mongoose.Schema.Types.ObjectId,
  studentName: String,
  matricNumber: String,

  // NEW
  filePath: String,

  score: { type: Number, default: null },
  status: { type: String, default: "Pending" }
});

module.exports = mongoose.model("Submission", SubmissionSchema);
