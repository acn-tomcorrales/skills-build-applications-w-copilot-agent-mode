"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityModel = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ["run", "cycle", "swim", "strength", "yoga", "walk"],
        required: true,
    },
    durationMin: { type: Number, required: true, min: 1 },
    caloriesBurned: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    performedAt: { type: Date, required: true },
}, { timestamps: true });
exports.ActivityModel = (0, mongoose_1.model)("Activity", activitySchema);
