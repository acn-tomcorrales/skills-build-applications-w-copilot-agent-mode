"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
async function verifyRoutes() {
    await (0, app_1.initializeDatabase)();
    const endpoints = [
        "/api/users/",
        "/api/teams/",
        "/api/activities/",
        "/api/leaderboard/",
        "/api/workouts/",
    ];
    for (const endpoint of endpoints) {
        const response = await (0, supertest_1.default)(app_1.app).get(endpoint).expect(200);
        console.log(`${endpoint} -> count=${response.body.count}; message=${response.body.message}`);
    }
}
verifyRoutes()
    .catch((error) => {
    console.error("API verification failed:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
