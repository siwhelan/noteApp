const app = require("./app");

// If not in test mode, start the server
if (process.env.NODE_ENV !== "test") {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
