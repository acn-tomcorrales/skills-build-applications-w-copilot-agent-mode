import mongoose from "mongoose";
import request from "supertest";
import { app, initializeDatabase } from "../app";

async function verifyRoutes() {
  await initializeDatabase();

  const endpoints = [
    "/api/users/",
    "/api/teams/",
    "/api/activities/",
    "/api/leaderboard/",
    "/api/workouts/",
  ];

  for (const endpoint of endpoints) {
    const response = await request(app).get(endpoint).expect(200);
    console.log(
      `${endpoint} -> count=${response.body.count}; message=${response.body.message}`,
    );
  }
}

verifyRoutes()
  .catch((error) => {
    console.error("API verification failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
