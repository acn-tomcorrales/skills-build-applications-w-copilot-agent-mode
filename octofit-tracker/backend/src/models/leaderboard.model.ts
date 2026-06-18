import { InferSchemaType, Schema, model } from "mongoose";

const rankingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const leaderboardSchema = new Schema(
  {
    metric: {
      type: String,
      enum: ["weekly_points", "distance_km", "calories_burned"],
      required: true,
    },
    periodLabel: { type: String, required: true, trim: true },
    rankings: { type: [rankingSchema], default: [] },
  },
  { timestamps: true },
);

export type Leaderboard = InferSchemaType<typeof leaderboardSchema>;
export const LeaderboardModel = model("Leaderboard", leaderboardSchema);
