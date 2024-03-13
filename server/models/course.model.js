const mongoose = require("mongoose");

// Define schema for Course
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
});
const Course = mongoose.model("Course", courseSchema);

module.exports = { Course };
