import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  subject: String,
  description: String,
  level: String,
  lessons: Number,
  tags: [String],
  thumbnail: String
}, { timestamps: true });

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
  progress: { type: Number, default: 0 },
  completedLessons: { type: Number, default: 0 },
  lastLesson: { type: String, default: "" }
}, { timestamps: true });

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Course = mongoose.model("Course", schema);
export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
