import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Course, Enrollment } from "../models/Course";

export async function listCourses(req: AuthRequest, res: Response) {
  const courses = await Course.find().sort({ createdAt: 1 });
  const enrollments = await Enrollment.find({ userId: req.user!.userId }).lean();
  const map = new Map(enrollments.map(e => [String(e.courseId), e]));
  const data = courses.map(c => ({
    ...c.toObject(),
    enrollment: map.get(String(c._id)) || null,
    progress: map.get(String(c._id))?.progress || 0
  }));
  res.json({ success: true, data });
}

export async function enroll(req: AuthRequest, res: Response) {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  const data = await Enrollment.findOneAndUpdate(
    { userId: req.user!.userId, courseId: course._id },
    { $setOnInsert: { userId: req.user!.userId, courseId: course._id } },
    { upsert: true, new: true }
  ).populate("courseId");
  res.status(201).json({ success: true, data });
}

export async function updateEnrollment(req: AuthRequest, res: Response) {
  const data = await Enrollment.findOneAndUpdate(
    { userId: req.user!.userId, courseId: req.params.id },
    { progress: Math.max(0, Math.min(100, Number(req.body.progress) || 0)), completedLessons: Number(req.body.completedLessons) || 0, lastLesson: req.body.lastLesson || "" },
    { new: true }
  );
  if (!data) return res.status(404).json({ success: false, message: "Enrollment not found" });
  res.json({ success: true, data });
}
