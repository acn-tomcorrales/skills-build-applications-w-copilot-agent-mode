"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutModel = void 0;
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    focus: {
        type: String,
        enum: ["cardio", "strength", "mobility", "recovery", "hiit"],
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    durationMin: { type: Number, required: true, min: 5 },
    equipment: { type: [String], default: [] },
    steps: { type: [String], default: [] },
}, { timestamps: true });
exports.WorkoutModel = (0, mongoose_1.model)("Workout", workoutSchema);
