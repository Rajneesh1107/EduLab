// Import required packages
require("dotenv").config();

const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const connection = require("./lib/db/mongodb");

// Create an instance of Express application
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure HTTP headers
app.use(morgan("dev")); // Logging HTTP requests

// Dynamically load all routes
fs.readdirSync(`${__dirname}/routes/api`).map((file) => {
  require(`./routes/api/${file}`)(app);
});

// const PORT = process.env.PORT || 8000; //if PORT is present in .env run at that else at default port 8000;
const PORT = 3000;

// Start the server
app.listen(PORT, async () => {
  // Establish connection to MongoDB
  await connection();

  // Log server start-up message
  console.log(`server is running port  at ${PORT}`);
});
