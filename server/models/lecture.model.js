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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor", // Reference to the Instructor model
    required: true,
  },
  videoUrl: { type: String },
  attachments: [{ type: String }],
  date: { type: Date, default: Date.now },
});

// Define index
courseSchema.index({ title: 1 });

// Create model based on the schemas
const Lecture = mongoose.model("Lecture", lectureSchema);

//export Lecture model
module.exports = Lecture;
