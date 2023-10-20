const request = require("supertest");
const mongoose = require("mongoose");

// Set environment as 'test'
process.env.NODE_ENV = "test";

// Connection is handled in app.js
const app = require("../app");

const Note = require("../models/Note");

// Clear any existing collection
/*beforeEach(async () => {
  await Note.deleteMany({});
});*/

// Close connction to prevent hanging client
afterAll(async () => {
  await mongoose.connection.close();
});

// Tests:
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
});
