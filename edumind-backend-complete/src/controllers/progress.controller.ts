import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ProgressEvent } from "../models/ProgressEvent";
import { QuizAttempt } from "../models/QuizAttempt";
import { StudyTask } from "../models/StudyTask";
import { Enrollment } from "../models/Course";

export async function summary(req: AuthRequest, res: Response) {
  const userId = req.user!.userId;
  const [attempts, tasks, enrollments, events] = await Promise.all([
    QuizAttempt.find({ userId }).sort({ createdAt: -1 }).limit(100).lean(),
    StudyTask.find({ userId }).lean(),
    Enrollment.find({ userId }).lean(),
    ProgressEvent.find({ userId }).sort({ createdAt: -1 }).limit(100).lean()
  ]);

  const average = attempts.length ? Math.round(attempts.reduce((n, a) => n + a.percentage, 0) / attempts.length) : 0;
  const completedTasks = tasks.filter(t => t.done).length;
  const studyMinutes = tasks.reduce((n, t) => n + (t.done ? t.minutes : 0), 0);
  const chart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const dayAttempts = attempts.filter(a => new Date(a.createdAt).toISOString().slice(0, 10) === key);
    return { day: d.toLocaleDateString("en-US", { weekday: "short" }), score: dayAttempts.length ? Math.round(dayAttempts.reduce((n,a)=>n+a.percentage,0)/dayAttempts.length) : 0 };
  });

  res.json({ success: true, data: {
    averageQuizScore: average,
    quizAttempts: attempts.length,
    studySessions: tasks.length,
    completedSessions: completedTasks,
    studyHours: Math.round((studyMinutes / 60) * 10) / 10,
    enrolledCourses: enrollments.length,
    chart,
    recentAttempts: attempts.slice(0, 10),
    events: events.slice(0, 20)
  }});
}
