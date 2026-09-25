import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  answers: { type: [Number], default: [] },
  score: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 }
}, { timestamps: true });

export const QuizAttempt = mongoose.model("QuizAttempt", schema);
