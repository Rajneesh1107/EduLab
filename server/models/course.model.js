const mongoose = require("mongoose");

// Define schema for Course
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lecture" }],
});

// Define index
courseSchema.index({ title: 1 });

// created course model acording to above schema;
const Course = mongoose.model("Course", courseSchema);

//export Course model
module.exports = Course;
