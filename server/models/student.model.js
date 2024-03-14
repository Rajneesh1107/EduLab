const mongoose = require("mongoose");

// Define schema for Student
const studentSchema = new mongoose.Schema(
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
      index: true, //define index
    },
    password: { type: String, required: [true, "please enter your password"] },
    avatar: {
      type: String,
      default:
        "https://www.clipartkey.com/mpngs/m/82-825843_tuba-app-for-students-student-profile-logo.png",
    },
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Assuming students can enroll in multiple courses
    dateOfBirth: { type: Date, default: null },
    phoneNumber: { type: String, default: "" },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create model based on the schemas
const Student = mongoose.model("Student", studentSchema);

// Export the model
module.exports = Student;
