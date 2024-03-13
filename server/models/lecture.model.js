const mongoose = require("mongoose");

// Define schema for Lecture
const lectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  content: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  videoUrl: { type: String },
  attachments: [{ type: String }],
  date: { type: Date, default: Date.now },
});
const Lecture = mongoose.model("Lecture", lectureSchema);

module.exports = { Lecture };
