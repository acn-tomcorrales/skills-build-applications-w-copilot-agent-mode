"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    age: { type: Number, min: 13, max: 100 },
    heightCm: { type: Number, min: 100, max: 250 },
    weightKg: { type: Number, min: 30, max: 300 },
    fitnessLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        required: true,
    },
    team: { type: mongoose_1.Schema.Types.ObjectId, ref: "Team" },
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
