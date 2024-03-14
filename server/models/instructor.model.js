const mongoose = require("mongoose");

// Define schema for Faculty
const InstructorSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, "please enter your first name"] },
  lastName: { type: String, required: [true, "please enter your last name"] },
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
  },
  password: { type: String, required: [true, "please enter your password"] },
  isAdmin: { type: Boolean, default: false }, // for creating role based access controll
  coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Assuming instructors members can teach multiple courses
});

// Create model based on the schema
const Instructor = mongoose.model("Instructor", InstructorSchema);

// Export the models
module.exports = Instructor;
