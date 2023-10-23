// server.js

const mongoose = require("mongoose");
const app = require("./app");

// Connect to MongoDB
const DB_URI = process.env.MONGO_URI;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    console.log("App ready for use");
  } catch (err) {
    console.log("Could not connect to MongoDB:", err.message);
  }
};

// If not in test mode, connect to MongoDB and start the server
if (process.env.NODE_ENV !== "test") {
  connectToMongoDB();
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
