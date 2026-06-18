import { InferSchemaType, Schema, model } from "mongoose";

const workoutSchema = new Schema(
  {
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
  },
  { timestamps: true }
);

export type Workout = InferSchemaType<typeof workoutSchema>;
export const WorkoutModel = model("Workout", workoutSchema);