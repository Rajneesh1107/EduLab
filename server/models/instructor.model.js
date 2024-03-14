const mongoose = require("mongoose");

// Define schema for Faculty
const InstructorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "please enter your first name"],
    },
    lastName: { type: String, required: [true, "please enter your last name"] },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
      index: true, //define the index
    },
    avatar: {
      type: String,
      default:
        "https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png",
    },
    password: { type: String, required: [true, "please enter your password"] },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
    phoneNumber: { type: String, default: null },
    coursesTaught: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Assuming instructors members can teach multiple courses
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create model based on the schema
const Instructor = mongoose.model("Instructor", InstructorSchema);

// Export the models
module.exports = Instructor;
