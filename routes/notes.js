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
    // 500: Internal Server Error
    res.status(500).send("Error retrieving notes");
  }
});

// Create a new note
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    // Logic to assign a unique number to the new note by counting the total number of notes,
    // selecting the one with the highest noteNumber and adding 1. This means that the new
    // noteNumber is always one greater than the highest existing noteNumber, ensuring uniqueness and
    // avoiding 'duplicate key error' if any notes are deleted.
    const lastNote = await Note.findOne().sort({ noteNumber: -1 });
    let noteNumber = 1;

    if (lastNote) {
      noteNumber = lastNote.noteNumber + 1;
    }

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
// Use parseInt to convert the string noteNumber (like "5") to an integer
// req.params captures values in the URL path (e.g., "/5" becomes { noteNumber: "5" }),
// which simplifies data extraction, providing an easier way to work with dynamic parts of URLs

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

// Delete a note by its noteNumber
router.delete("/:noteNumber", async (req, res) => {
  try {
    const noteNumber = parseInt(req.params.noteNumber);
    await Note.deleteOne({ noteNumber: noteNumber });

    res.status(200).send("Note deleted successfully");
  } catch (error) {
    console.error("Error in DELETE /notes:", error);
    res.status(500).send("Error deleting the note");
  }
});

module.exports = router;
