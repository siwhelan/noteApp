const Note = require("../models/Note");
const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app;

process.env.NODE_ENV = "test"; // Set environment for testing

// Setup and teardown for MongoDB test collection
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app = require("../app");
});

// Clear any existing data
beforeEach(async () => {
  await Note.deleteMany({});
});

// Close the connection once the tests are done
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Helper function to determine the next unique note number.
// Required because the database was cleared further up the stack
// for cleanliness and there are currently no noteNumbers to find.
async function getNextNoteNumber() {
  const lastNote = await Note.findOne().sort({ noteNumber: -1 });
  return lastNote && lastNote.noteNumber ? lastNote.noteNumber + 1 : 1;
}

// Test cases
describe("GET /notes", () => {
  it("should respond with 200 OK", async () => {
    const response = await request(app).get("/notes");
    expect(response.status).toBe(200);
  });
});

describe("POST /notes", () => {
  it("should respond with a redirect on post", async () => {
    const response = await request(app).post("/notes").send({
      title: "Test Note",
      content: "This is a test note",
    });
    expect(response.status).toBe(302);
  });

  it("should respond with a 400 Bad Request on post with incorrect fields", async () => {
    const response = await request(app).post("/notes").send({
      title: 12,
      content: 34567,
    });
    expect(response.status).toBe(400);
  });
});

describe("GET /notes/:noteNumber", () => {
  let noteNumber;

  beforeEach(async () => {
    noteNumber = await getNextNoteNumber();
    const note = new Note({
      title: "Sample Note",
      content: "Sample Content",
      noteNumber: noteNumber,
    });
    await note.save();
  });

  it("should respond with 200 OK", async () => {
    const response = await request(app).get(`/notes/${noteNumber}`);
    expect(response.status).toBe(200);
  });

  it("should respond with 404 Not Found for non-existent noteNumber", async () => {
    const response = await request(app).get("/notes/9999");
    expect(response.status).toBe(404);
  });
});

describe("DELETE /notes/:noteNumber", () => {
  it("should delete a product", async () => {
    const res = await request(app).delete("/notes/1");
    expect(res.statusCode).toBe(200);
  });
});

