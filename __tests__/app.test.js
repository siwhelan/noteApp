const request = require("supertest");
const app = require("../app");

// Test the default redirection to `/notes` endpoint
describe("App basic tests", () => {
  it("should redirect from root to /notes", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/notes");
  });
});
