import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: Number,
  explanation: String
}, { _id: false });

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: String,
  subject: String,
  topic: String,
  difficulty: String,
  questions: [questionSchema],
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });

export const Quiz = mongoose.model("Quiz", quizSchema);
