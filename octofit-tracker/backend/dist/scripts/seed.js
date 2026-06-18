"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const activity_model_1 = require("../models/activity.model");
const leaderboard_model_1 = require("../models/leaderboard.model");
const team_model_1 = require("../models/team.model");
const user_model_1 = require("../models/user.model");
const workout_model_1 = require("../models/workout.model");
async function seedDatabase() {
    console.log("Seed the octofit_db database with test data");
    await (0, database_1.connectToDatabase)();
    await Promise.all([
        leaderboard_model_1.LeaderboardModel.deleteMany({}),
        activity_model_1.ActivityModel.deleteMany({}),
        team_model_1.TeamModel.deleteMany({}),
        user_model_1.UserModel.deleteMany({}),
        workout_model_1.WorkoutModel.deleteMany({}),
    ]);
    const users = await user_model_1.UserModel.insertMany([
        {
            username: "ava_runner",
            email: "ava.runner@octofit.local",
            age: 29,
            heightCm: 168,
            weightKg: 61,
            fitnessLevel: "advanced",
        },
        {
            username: "liam_lifter",
            email: "liam.lifter@octofit.local",
            age: 33,
            heightCm: 181,
            weightKg: 84,
            fitnessLevel: "intermediate",
        },
        {
            username: "mia_motion",
            email: "mia.motion@octofit.local",
            age: 26,
            heightCm: 165,
            weightKg: 57,
            fitnessLevel: "beginner",
        },
    ]);
    const team = await team_model_1.TeamModel.create({
        name: "Harbor Hustlers",
        city: "Seattle",
        motto: "Consistency over intensity",
        members: users.map((user) => user._id),
    });
    await user_model_1.UserModel.updateMany({ _id: { $in: users.map((user) => user._id) } }, { $set: { team: team._id } });
    await activity_model_1.ActivityModel.insertMany([
        {
            user: users[0]._id,
            type: "run",
            durationMin: 42,
            caloriesBurned: 510,
            distanceKm: 8.6,
            performedAt: new Date("2026-06-15T06:30:00.000Z"),
        },
        {
            user: users[1]._id,
            type: "strength",
            durationMin: 55,
            caloriesBurned: 460,
            performedAt: new Date("2026-06-16T17:15:00.000Z"),
        },
        {
            user: users[2]._id,
            type: "yoga",
            durationMin: 35,
            caloriesBurned: 180,
            performedAt: new Date("2026-06-17T12:00:00.000Z"),
        },
        {
            user: users[0]._id,
            type: "cycle",
            durationMin: 60,
            caloriesBurned: 640,
            distanceKm: 21.4,
            performedAt: new Date("2026-06-17T07:10:00.000Z"),
        },
    ]);
    await workout_model_1.WorkoutModel.insertMany([
        {
            title: "Sunrise Tempo Run",
            focus: "cardio",
            difficulty: "intermediate",
            durationMin: 45,
            equipment: ["running shoes", "sports watch"],
            steps: [
                "5 minute brisk warm-up",
                "30 minute tempo run",
                "10 minute cooldown walk",
            ],
        },
        {
            title: "Garage Strength Circuit",
            focus: "strength",
            difficulty: "advanced",
            durationMin: 50,
            equipment: ["dumbbells", "kettlebell", "exercise mat"],
            steps: [
                "3 rounds goblet squats",
                "3 rounds push press",
                "3 rounds renegade rows",
            ],
        },
        {
            title: "Recovery Mobility Flow",
            focus: "recovery",
            difficulty: "beginner",
            durationMin: 25,
            equipment: ["yoga mat"],
            steps: [
                "Hip openers for 8 minutes",
                "Thoracic spine rotations for 7 minutes",
                "Breath-focused cooldown for 10 minutes",
            ],
        },
    ]);
    await leaderboard_model_1.LeaderboardModel.create({
        metric: "weekly_points",
        periodLabel: "2026-W25",
        rankings: [
            { user: users[0]._id, score: 980, rank: 1 },
            { user: users[1]._id, score: 870, rank: 2 },
            { user: users[2]._id, score: 640, rank: 3 },
        ],
    });
    const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
        user_model_1.UserModel.countDocuments(),
        team_model_1.TeamModel.countDocuments(),
        activity_model_1.ActivityModel.countDocuments(),
        leaderboard_model_1.LeaderboardModel.countDocuments(),
        workout_model_1.WorkoutModel.countDocuments(),
    ]);
    console.log(`Connected to ${database_1.mongoUri}`);
    console.log("Seed complete.");
    console.log({
        users: userCount,
        teams: teamCount,
        activities: activityCount,
        leaderboard: leaderboardCount,
        workouts: workoutCount,
    });
}
seedDatabase()
    .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
