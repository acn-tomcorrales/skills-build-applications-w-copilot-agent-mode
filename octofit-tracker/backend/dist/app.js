"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiBaseUrl = exports.port = exports.app = void 0;
exports.initializeDatabase = initializeDatabase;
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const activity_model_1 = require("./models/activity.model");
const leaderboard_model_1 = require("./models/leaderboard.model");
const team_model_1 = require("./models/team.model");
const user_model_1 = require("./models/user.model");
const workout_model_1 = require("./models/workout.model");
exports.app = (0, express_1.default)();
exports.port = 8000;
const codespaceName = process.env.CODESPACE_NAME;
exports.apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : "http://localhost:8000";
exports.app.use(express_1.default.json());
exports.app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", apiBaseUrl: exports.apiBaseUrl });
});
exports.app.get("/api", (_request, response) => {
    response.json({
        apiBaseUrl: exports.apiBaseUrl,
        routes: {
            users: `${exports.apiBaseUrl}/api/users/`,
            teams: `${exports.apiBaseUrl}/api/teams/`,
            activities: `${exports.apiBaseUrl}/api/activities/`,
            leaderboard: `${exports.apiBaseUrl}/api/leaderboard/`,
            workouts: `${exports.apiBaseUrl}/api/workouts/`,
        },
    });
});
exports.app.get("/api/users/", async (_request, response) => {
    const items = await user_model_1.UserModel.find().populate("team", "name city").lean();
    response.json({ message: "Users", count: items.length, items });
});
exports.app.get("/api/teams/", async (_request, response) => {
    const items = await team_model_1.TeamModel.find()
        .populate("members", "username email")
        .lean();
    response.json({ message: "Teams", count: items.length, items });
});
exports.app.get("/api/activities/", async (_request, response) => {
    const items = await activity_model_1.ActivityModel.find()
        .populate("user", "username fitnessLevel")
        .sort({ performedAt: -1 })
        .lean();
    response.json({ message: "Activities", count: items.length, items });
});
exports.app.get("/api/leaderboard/", async (_request, response) => {
    const items = await leaderboard_model_1.LeaderboardModel.find()
        .populate("rankings.user", "username")
        .sort({ createdAt: -1 })
        .lean();
    response.json({ message: "Leaderboard", count: items.length, items });
});
exports.app.get("/api/workouts/", async (_request, response) => {
    const items = await workout_model_1.WorkoutModel.find()
        .sort({ difficulty: 1, durationMin: 1 })
        .lean();
    response.json({ message: "Workouts", count: items.length, items });
});
async function initializeDatabase() {
    try {
        await (0, database_1.connectToDatabase)();
        console.log(`Connected to MongoDB at ${database_1.mongoUri}`);
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}
