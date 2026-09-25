import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Document } from "../models/Document";
import { QuizAttempt } from "../models/QuizAttempt";
import { StudyTask } from "../models/StudyTask";
import { Enrollment } from "../models/Course";
import { User } from "../models/User";

export async function dashboard(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const [user, documents, attempts, tasks, enrollments] = await Promise.all([
    User.findById(userId).select("-passwordHash").lean(),
    Document.find({ ownerId: userId }).select("-extractedText -filePath").sort({ createdAt: -1 }).limit(10).lean(),
    QuizAttempt.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
    StudyTask.find({ userId }).sort({ date: 1 }).limit(20).lean(),
    Enrollment.find({ userId }).populate("courseId").lean()
  ]);
  const average = attempts.length ? Math.round(attempts.reduce((n,a)=>n+a.percentage,0)/attempts.length) : 0;
  res.json({ success:true, data:{
    user, stats:{documents:documents.length, quizSessions:attempts.length, studyHours:Math.round(tasks.filter(t=>t.done).reduce((n,t)=>n+t.minutes,0)/60*10)/10, goalsCompleted:tasks.filter(t=>t.done).length, averageQuizScore:average},
    documents, tasks, courses:enrollments
  }});
}
