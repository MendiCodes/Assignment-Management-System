const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  title: String,
  courseCode: String,
  deadline: Date,
  lecturerId: mongoose.Schema.Types.ObjectId,
  publicId: String,

  // NEW
  resultsPublic: {
    type: Boolean,
    default: false
  },
  resultsPublicId: String
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
