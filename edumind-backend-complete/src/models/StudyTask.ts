import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  minutes: { type: Number, default: 60 },
  done: { type: Boolean, default: false }
}, { timestamps: true });

export const StudyTask = mongoose.model("StudyTask", schema);
