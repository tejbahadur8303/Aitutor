import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["QUIZ", "STUDY", "CHAT", "DOCUMENT", "COURSE"], required: true },
  value: { type: Number, default: 0 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const ProgressEvent = mongoose.model("ProgressEvent", schema);
