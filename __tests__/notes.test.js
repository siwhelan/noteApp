const Note = require("../models/Note");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app;

// Set environment as 'test' to prevent unwanted logs and other test-specific behaviors.
process.env.NODE_ENV = "test";

beforeAll(async () => {
  // Before all tests, set up an in-memory MongoDB server.
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect our Mongoose instance to the in-memory MongoDB server.
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app = require("../app");
});

beforeEach(async () => {
  // Before each test, clear the database to ensure no leftover data affects tests.
  await Note.deleteMany({});
});

afterAll(async () => {
  // After all tests, close the Mongoose connection and stop the in-memory MongoDB server.
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Test to check all notes
describe("GET /notes", () => {
  it("should respond with 200 OK", async () => {
    const response = await request(app).get("/notes");
    expect(response.status).toBe(200);
  });
});

// Test to check new note creation
describe("POST /notes", () => {
  it("should respond with a redirect on post", async () => {
    const response = await request(app).post("/notes").send({
      title: "Test Note",
      content: "This is a test note",
    });
    expect(response.status).toBe(302);
  });
});

// Helper function to determine the next unique note number.
// Required because the database was cleared furtherr up the stack
// for cleanliness and there are currently no noteNumbers to find.
async function getNextNoteNumber() {
  // Fetch the most recent note based on noteNumber.
  const lastNote = await Note.findOne().sort({ noteNumber: -1 });

  // If a note exists, return the next incremental noteNumber. Otherwise, return 1.
  return lastNote && lastNote.noteNumber ? lastNote.noteNumber + 1 : 1;
}

// Test retrieval of a note by it's number
describe("GET /notes/:noteNumber", () => {
  let noteNumber;

  beforeEach(async () => {
    // Before the test, determine the unique noteNumber using the helper function.
    noteNumber = await getNextNoteNumber();

    // Create a new note with the determined noteNumber.
    const note = new Note({
      title: "Sample Note",
      content: "Sample Content",
      noteNumber: noteNumber,
    });

    // Save the note to the database.
    await note.save();
  });

  it("should respond with 200 OK", async () => {
    // Fetch the note using its unique noteNumber and expect a 200 OK status.
    const response = await request(app).get(`/notes/${noteNumber}`);
    expect(response.status).toBe(200);
  });
});

// Test response for a non-existing note
describe("GET /notes/:noteNumber", () => {
  it("should respond with 404 Not Found for non-existent noteNumber", async () => {
    // Try fetching a note using a non-existent noteNumber and expect a 404 Not Found status.
    const response = await request(app).get("/notes/9999");
    expect(response.status).toBe(404);
  });
});

// Test for a note created with incorrect fields
describe("POST /notes", () => {
  it("should respond with a 400 Bad Request on post", async () => {
    const response = await request(app).post("/notes").send({
      title: 12,
      content: 34567,
    });
    expect(response.status).toBe(400);
  });
});
