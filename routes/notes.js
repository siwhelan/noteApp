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

// Display the edit form for a note
router.get("/edit/:noteNumber", async (req, res) => {
  try {
    // Extract the noteNumber from the URL parameter and parse it into an integer.
    const noteNumber = parseInt(req.params.noteNumber);

    // Query the database to find a note with the specified noteNumber.
    const note = await Note.findOne({ noteNumber: noteNumber });

    // If the note is found, render the "edit" template with the note's data.
    if (note) {
      res.render("edit", { note });
    } else {
      // If the note is not found, respond with a 404 Not Found
      res.status(404).send("Note not found");
    }
  } catch (error) {
    // Handle any unexpected errors with a 500 (Internal Server Error) response.
    res.status(500).send("Internal server error");
  }
});

// Handle the update of a note
router.post("/update/:noteNumber", async (req, res) => {
  try {
    // Extract the noteNumber from the URL parameter and parse it into an integer.
    const noteNumber = parseInt(req.params.noteNumber);

    // Extract the updated title and content from the request body.
    const { title, content } = req.body;

    // Update the note in the database with the new title and content.
    const updatedNote = await Note.findOneAndUpdate(
      { noteNumber: noteNumber },
      { title, content },
      { new: true } // Returns the updated document
    );

    // If the update is successful and a note is found, redirect to the note's individual page.
    if (updatedNote) {
      res.redirect(`/notes/${noteNumber}`);
    } else {
      // If the note is not found, respond with a 404 (Not Found) status.
      res.status(404).send("Note not found");
    }
  } catch (error) {
    // Handle any unexpected errors with a 500 (Internal Server Error) response.
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
