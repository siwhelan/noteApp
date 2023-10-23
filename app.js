const express = require("express");
const bodyParser = require("body-parser");
const notesRoutes = require("./routes/notes");
const app = express();
require("dotenv").config();

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
