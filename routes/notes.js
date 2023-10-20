const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find();

    // 200: OK - Response for successful requests
    res.status(200).render("index", { notes });
  } catch (error) {
    // 500: Internal Server Error - Generic error message
    res.status(500).send("Error retrieving notes");
  }
});

// Create a new note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    // Determine new note's number by counting existng notes and adding 1
    const noteCount = await Note.countDocuments();
    const noteNumber = noteCount + 1;

    const note = new Note({ title, content, noteNumber });
    await note.save();

    // 201: Created - The request has been fulfilled and has resulted in a new note being created.
    res.status(201).redirect("/notes");
  } catch (error) {
    console.error("Error in POST /notes:", error);
    res.status(500).send("Error creating the note");
  }
});

// Get a single note by its noteNumber
router.get("/:noteNumber", async (req, res) => {
  try {
    const noteNumber = parseInt(req.params.noteNumber);
    const note = await Note.findOne({ noteNumber: noteNumber });

    if (note) {
      res.render("note", { note });
    } else {
      res.status(404).send("Note not found");
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
