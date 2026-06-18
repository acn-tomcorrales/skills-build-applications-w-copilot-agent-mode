import mongoose from "mongoose";
import { connectToDatabase, mongoUri } from "../config/database";
import { ActivityModel } from "../models/activity.model";
import { LeaderboardModel } from "../models/leaderboard.model";
import { TeamModel } from "../models/team.model";
import { UserModel } from "../models/user.model";
import { WorkoutModel } from "../models/workout.model";

async function seedDatabase() {
  console.log("Seed the octofit_db database with test data");
  await connectToDatabase();

  await Promise.all([
    LeaderboardModel.deleteMany({}),
    ActivityModel.deleteMany({}),
    TeamModel.deleteMany({}),
    UserModel.deleteMany({}),
    WorkoutModel.deleteMany({}),
  ]);

  const users = await UserModel.insertMany([
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

  const team = await TeamModel.create({
    name: "Harbor Hustlers",
    city: "Seattle",
    motto: "Consistency over intensity",
    members: users.map((user) => user._id),
  });

  await UserModel.updateMany(
    { _id: { $in: users.map((user) => user._id) } },
    { $set: { team: team._id } },
  );

  await ActivityModel.insertMany([
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

  await WorkoutModel.insertMany([
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

  await LeaderboardModel.create({
    metric: "weekly_points",
    periodLabel: "2026-W25",
    rankings: [
      { user: users[0]._id, score: 980, rank: 1 },
      { user: users[1]._id, score: 870, rank: 2 },
      { user: users[2]._id, score: 640, rank: 3 },
    ],
  });

  const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] =
    await Promise.all([
      UserModel.countDocuments(),
      TeamModel.countDocuments(),
      ActivityModel.countDocuments(),
      LeaderboardModel.countDocuments(),
      WorkoutModel.countDocuments(),
    ]);

  console.log(`Connected to ${mongoUri}`);
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
    await mongoose.disconnect();
  });
