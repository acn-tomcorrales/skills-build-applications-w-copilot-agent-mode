import { InferSchemaType, Schema, model } from "mongoose";

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true },
    motto: { type: String, required: true, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export type Team = InferSchemaType<typeof teamSchema>;
export const TeamModel = model("Team", teamSchema);
