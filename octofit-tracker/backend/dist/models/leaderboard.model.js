"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardModel = void 0;
const mongoose_1 = require("mongoose");
const rankingSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
}, { _id: false });
const leaderboardSchema = new mongoose_1.Schema({
    metric: {
        type: String,
        enum: ["weekly_points", "distance_km", "calories_burned"],
        required: true,
    },
    periodLabel: { type: String, required: true, trim: true },
    rankings: { type: [rankingSchema], default: [] },
}, { timestamps: true });
exports.LeaderboardModel = (0, mongoose_1.model)("Leaderboard", leaderboardSchema);
