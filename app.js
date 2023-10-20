const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const notesRoutes = require("./routes/notes");
const app = express();
require("dotenv").config();

// Connect to MongoDB
const DB_URI = process.env.MONGO_URI;

// Establish asynchronous MongoDB connection
(async () => {
  try {
    // Connect using the new URL string parser and the modern topology engine
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true, // Use MongoDB's newer URL string parser
      useUnifiedTopology: true, // Use modern engine for consistent connection and newer features
    });

    // Log success if not in test mode
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
      console.log("App ready for use");
    }
  } catch (err) {
    // Log errors if not in test mode
    if (process.env.NODE_ENV !== "test") {
      console.log("Could not connect to MongoDB:", err.message);
    }
  }
})();

// Body-parser middleware for incoming requests
// Parse URL-encoded data with the built-in querystring library
app.use(bodyParser.urlencoded({ extended: false }));
// Parse incoming JSON requests
app.use(bodyParser.json());

// Set up ejs as the view engine
app.set("view engine", "ejs");

// Set up the static files middleware
app.use(express.static("public"));

// Set up the routes middleware
app.use("/notes", notesRoutes);

// Home page route
app.get("/", (req, res) => {
  res.redirect("/notes");
});

// Export the app instance for testing etc
module.exports = app;
