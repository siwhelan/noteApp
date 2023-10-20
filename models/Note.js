const mongoose = require("mongoose");

// Set required properties for notes
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  noteNumber: {
    type: Number,
    required: true,
    unique: true,
  },
});

const collectionName = process.env.NODE_ENV === "test" ? "TestNotes" : "Notes";
module.exports = mongoose.model("Note", NoteSchema, collectionName);
