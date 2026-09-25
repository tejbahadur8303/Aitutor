import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["STUDENT", "TEACHER", "ADMIN"], default: "STUDENT" },
  grade: { type: String, default: "" },
  subjects: { type: [String], default: [] },
  learningGoals: { type: [String], default: [] },
  avatar: { type: String, default: "" }
}, { timestamps: true });

export const User = mongoose.model("User", schema);
