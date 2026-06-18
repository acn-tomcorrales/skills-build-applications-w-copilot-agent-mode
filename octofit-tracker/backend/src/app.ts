import express from "express";
import { connectToDatabase, mongoUri } from "./config/database";
import { ActivityModel } from "./models/activity.model";
import { LeaderboardModel } from "./models/leaderboard.model";
import { TeamModel } from "./models/team.model";
import { UserModel } from "./models/user.model";
import { WorkoutModel } from "./models/workout.model";

export const app = express();
export const port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
export const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", apiBaseUrl });
});

app.get("/api", (_request, response) => {
  response.json({
    apiBaseUrl,
    routes: {
      users: `${apiBaseUrl}/api/users/`,
      teams: `${apiBaseUrl}/api/teams/`,
      activities: `${apiBaseUrl}/api/activities/`,
      leaderboard: `${apiBaseUrl}/api/leaderboard/`,
      workouts: `${apiBaseUrl}/api/workouts/`,
    },
  });
});

app.get("/api/users/", async (_request, response) => {
  const items = await UserModel.find().populate("team", "name city").lean();
  response.json({ message: "Users", count: items.length, items });
});

app.get("/api/teams/", async (_request, response) => {
  const items = await TeamModel.find().populate("members", "username email").lean();
  response.json({ message: "Teams", count: items.length, items });
});

app.get("/api/activities/", async (_request, response) => {
  const items = await ActivityModel.find()
    .populate("user", "username fitnessLevel")
    .sort({ performedAt: -1 })
    .lean();
  response.json({ message: "Activities", count: items.length, items });
});

app.get("/api/leaderboard/", async (_request, response) => {
  const items = await LeaderboardModel.find()
    .populate("rankings.user", "username")
    .sort({ createdAt: -1 })
    .lean();
  response.json({ message: "Leaderboard", count: items.length, items });
});

app.get("/api/workouts/", async (_request, response) => {
  const items = await WorkoutModel.find().sort({ difficulty: 1, durationMin: 1 }).lean();
  response.json({ message: "Workouts", count: items.length, items });
});

export async function initializeDatabase() {
  try {
    await connectToDatabase();
    console.log(`Connected to MongoDB at ${mongoUri}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}