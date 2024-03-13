// Import required packages
require("dotenv").config();

const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

// Create an instance of Express application
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // Logging HTTP requests

app.get("/", (req, res) => {
  res.send("This is home page!");
});

// Start the server
// const PORT = process.env.PORT || 8000 //if PORT is presend run at that else at default port
const PORT = 3000; // Default to port 3000 if PORT is not specified in .env
app.listen(PORT, async () => {
  console.log(`server is running port  at ${PORT}`);
});
