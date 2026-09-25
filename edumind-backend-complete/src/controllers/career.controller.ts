import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { generateStructured } from "../services/ai";

const paths = [
  { title: "Software Development", skills: ["DSA", "React", "Node.js", "Git"], description: "Build web, mobile and software products." },
  { title: "Data & AI", skills: ["Python", "Statistics", "ML", "SQL"], description: "Work with data, machine learning and intelligent systems." },
  { title: "Cyber Security", skills: ["Networking", "Linux", "Security", "Python"], description: "Protect systems, applications and networks." },
  { title: "Cloud & DevOps", skills: ["Linux", "Docker", "Cloud", "CI/CD"], description: "Automate delivery and operate scalable infrastructure." }
];

export async function listPaths(req: AuthRequest, res: Response) {
  res.json({ success: true, data: paths });
}

export async function recommend(req: AuthRequest, res: Response) {
  const user = req.body;
  const prompt = `Give career guidance for a student.
Name: ${user.name || ""}
Grade: ${user.grade || ""}
Subjects: ${(user.subjects || []).join(", ")}
Interests: ${(user.interests || []).join(", ")}
Return JSON: {"paths":[{"title":"...","why":"...","skills":["..."],"firstSteps":["..."]}]}. Do not make claims about job guarantees.`;
  const result = await generateStructured<any>(prompt);
  res.json({ success: true, data: result || { paths } });
}
