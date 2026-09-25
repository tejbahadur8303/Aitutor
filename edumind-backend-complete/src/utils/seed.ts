import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Course } from "../models/Course";
import { env } from "../config/env";

async function seed() {
  await connectDB();

  const passwordHash = await bcrypt.hash("demo123", 10);
  const user = await User.findOneAndUpdate(
    { email: "student@edumind.ai" },
    {
      name: "Demo Student",
      email: "student@edumind.ai",
      passwordHash,
      role: "STUDENT",
      grade: "B.Tech CSE",
      subjects: ["Data Structures", "DBMS", "Operating Systems"],
      learningGoals: ["Improve DSA", "Build projects", "Prepare for interviews"]
    },
    { upsert: true, new: true }
  );

  const courses = [
    { title: "Data Structures & Algorithms", subject: "Computer Science", description: "Core DSA concepts and problem solving.", level: "Intermediate", lessons: 24, tags: ["DSA", "C++", "Algorithms"] },
    { title: "Database Management Systems", subject: "Computer Science", description: "SQL, normalization, indexing and transactions.", level: "Intermediate", lessons: 16, tags: ["DBMS", "SQL"] },
    { title: "Operating Systems", subject: "Computer Science", description: "Processes, memory, scheduling and file systems.", level: "Intermediate", lessons: 20, tags: ["OS", "Systems"] },
    { title: "Web Development", subject: "Computer Science", description: "Build modern web applications with React and Node.js.", level: "Beginner", lessons: 28, tags: ["React", "Node.js"] }
  ];

  for (const course of courses) {
    await Course.findOneAndUpdate({ title: course.title }, course, { upsert: true, new: true });
  }

  console.log(`Seed complete. Student: ${user.email} / demo123`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
