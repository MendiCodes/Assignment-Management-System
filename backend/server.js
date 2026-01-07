const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const assignmentRoutes = require("./routes/assignments");
const submissionRoutes = require("./routes/submissions");
const resultsRoutes = require("./routes/results");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/assignments", assignmentRoutes);
app.use("/api", submissionRoutes);
app.use("/api", resultsRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Assignment System API running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.log(err));
