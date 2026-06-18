import express from "express";
import mongoose from "mongoose";

const app = express();
const port = Number(process.env.PORT) || 8000;
const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/octofit_db";

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

async function connectToDatabase() {
  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

async function startServer() {
  await connectToDatabase();

  app.listen(port, () => {
    console.log(`Octofit Tracker API listening on port ${port}`);
  });
}

void startServer();
