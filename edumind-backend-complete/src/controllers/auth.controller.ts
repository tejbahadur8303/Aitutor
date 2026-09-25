import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";

const safeUser = (u: any) => ({
  id: String(u._id),
  _id: String(u._id),
  name: u.name,
  email: u.email,
  role: u.role,
  grade: u.grade || "",
  subjects: u.subjects || [],
  learningGoals: u.learningGoals || [],
  avatar: u.avatar || ""
});

export async function register(req: Request, res: Response) {
  const { name, email, password, role, subjects, grade, learningGoals } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
  if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, email: email.toLowerCase(), passwordHash,
    role: role === "TEACHER" || role === "ADMIN" ? "STUDENT" : "STUDENT",
    subjects: Array.isArray(subjects) ? subjects : [],
    grade: grade || "",
    learningGoals: Array.isArray(learningGoals) ? learningGoals : []
  });

  res.status(201).json({ success: true, data: { user: safeUser(user), token: signToken(String(user._id), user.role) } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase() });
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  res.json({ success: true, data: { user: safeUser(user), token: signToken(String(user._id), user.role) } });
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await User.findById(req.user!.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: safeUser(user) });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  const allowed = ["name", "grade", "subjects", "learningGoals", "avatar"];
  const update: any = {};
  for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];
  const user = await User.findByIdAndUpdate(req.user!.userId, update, { new: true }).select("-passwordHash");
  res.json({ success: true, data: safeUser(user) });
}
