import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { StudyTask } from "../models/StudyTask";
import { ProgressEvent } from "../models/ProgressEvent";

export async function listTasks(req: AuthRequest, res: Response) {
  const data = await StudyTask.find({ userId: req.user!.userId }).sort({ date: 1, createdAt: 1 });
  res.json({ success: true, data });
}

export async function createTask(req: AuthRequest, res: Response) {
  const { title, date, minutes = 60 } = req.body;
  if (!title || !date) return res.status(400).json({ success: false, message: "Title and date are required" });
  const task = await StudyTask.create({ userId: req.user!.userId, title, date, minutes: Number(minutes) || 60 });
  res.status(201).json({ success: true, data: task });
}

export async function updateTask(req: AuthRequest, res: Response) {
  const task = await StudyTask.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.userId },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ success: false, message: "Study task not found" });
  if (task.done) await ProgressEvent.create({ userId: req.user!.userId, type: "STUDY", value: task.minutes });
  res.json({ success: true, data: task });
}

export async function deleteTask(req: AuthRequest, res: Response) {
  const task = await StudyTask.findOneAndDelete({ _id: req.params.id, userId: req.user!.userId });
  if (!task) return res.status(404).json({ success: false, message: "Study task not found" });
  res.json({ success: true, message: "Task deleted" });
}
