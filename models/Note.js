// Importing the mongoose library for database operations
const mongoose = require("mongoose");

// Defining the structure & required fields for a 'Note' in the database
const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    noteNumber: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Determine collection name based on environment (test or production)
const collectionName = process.env.NODE_ENV === "test" ? "TestNotes" : "Notes";

// Export the model to be used in other parts of the application
module.exports = mongoose.model("Note", NoteSchema, collectionName);
