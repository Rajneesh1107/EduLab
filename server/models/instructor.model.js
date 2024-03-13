const mongoose = require("mongoose");

// Define schema for Faculty
const IntructorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

// Create model based on the schemas
const Instructor = mongoose.model("Instructor", IntructorSchema);

// Export the models
module.exports = {
  Instructor,
};
