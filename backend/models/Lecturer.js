const mongoose = require("mongoose");

const LecturerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

module.exports = mongoose.model("Lecturer", LecturerSchema);
