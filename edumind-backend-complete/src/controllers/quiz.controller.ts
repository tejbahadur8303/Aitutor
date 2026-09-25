import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { Quiz } from "../models/Quiz";
import { QuizAttempt } from "../models/QuizAttempt";
import { ProgressEvent } from "../models/ProgressEvent";
import { generateStructured } from "../services/ai";

type Generated = { questions: { question: string; options: string[]; correctAnswer: number; explanation: string }[] };

function fallbackQuestions(topic: string, count: number): Generated {
  const bank = [
    { question: `Which statement best describes ${topic}?`, options: ["A structured concept used to solve related problems", "Only a hardware component", "A database password", "A programming error"], correctAnswer: 0, explanation: `${topic} is a concept that can be studied through definitions, examples and practical applications.` },
    { question: `What is a useful way to learn ${topic}?`, options: ["Memorize without practice", "Understand the idea and solve examples", "Skip fundamentals", "Avoid reviewing mistakes"], correctAnswer: 1, explanation: "Understanding plus practice is a useful learning strategy." },
    { question: `Which approach improves understanding of ${topic}?`, options: ["Examples and problem solving", "Ignoring edge cases", "Never testing code", "Avoiding questions"], correctAnswer: 0, explanation: "Examples help connect theory with practical use." },
    { question: `What should you do after making a mistake in ${topic}?`, options: ["Ignore it", "Review the reasoning and retry", "Delete your notes", "Stop practicing"], correctAnswer: 1, explanation: "Reviewing mistakes helps identify gaps in understanding." }
  ];
  return { questions: Array.from({ length: count }, (_, i) => bank[i % bank.length]) };
}

export async function generateQuiz(req: AuthRequest, res: Response) {
  const { subject, topic, difficulty = "medium", numQuestions = 5 } = req.body;
  if (!topic) return res.status(400).json({ success: false, message: "Topic is required" });

  const count = Math.max(1, Math.min(Number(numQuestions) || 5, 20));
  const prompt = `Create ${count} multiple-choice questions for a student.
Subject: ${subject || "General"}
Topic: ${topic}
Difficulty: ${difficulty}
Return JSON exactly as {"questions":[{"question":"...","options":["A","B","C","D"],"correctAnswer":0,"explanation":"..."}]}.
correctAnswer must be a zero-based option index.`;

  const ai = await generateStructured<Generated>(prompt);
  const generated = ai?.questions?.length ? ai : fallbackQuestions(topic, count);
  generated.questions = generated.questions.slice(0, count).map(q => ({
    ...q,
    options: q.options?.slice(0, 4) || ["A", "B", "C", "D"],
    correctAnswer: Math.max(0, Math.min(3, Number(q.correctAnswer) || 0))
  }));

  const quiz = await Quiz.create({
    userId: req.user!.userId,
    title: `${topic} Quiz`,
    subject: subject || "General",
    topic,
    difficulty,
    questions: generated.questions
  });

  res.status(201).json({ success: true, data: quiz });
}

export async function getQuizzes(req: AuthRequest, res: Response) {
  const data = await Quiz.find({ userId: req.user!.userId }).select("-questions").sort({ createdAt: -1 });
  res.json({ success: true, data });
}

export async function getQuiz(req: AuthRequest, res: Response) {
  const data = await Quiz.findOne({ _id: req.params.id, userId: req.user!.userId });
  if (!data) return res.status(404).json({ success: false, message: "Quiz not found" });
  res.json({ success: true, data });
}

export async function submitQuiz(req: AuthRequest, res: Response) {
  const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user!.userId });
  if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

  const answers: number[] = Array.isArray(req.body.answers) ? req.body.answers : [];
  const score = quiz.questions.reduce((n, q, i) => n + (answers[i] === q.correctAnswer ? 1 : 0), 0);
  const total = quiz.questions.length;
  const percentage = total ? Math.round((score / total) * 100) : 0;

  await QuizAttempt.create({ userId: req.user!.userId, quizId: quiz._id, answers, score, total, percentage });
  quiz.score = percentage;
  quiz.completed = true;
  quiz.attempts += 1;
  await quiz.save();
  await ProgressEvent.create({ userId: req.user!.userId, type: "QUIZ", value: percentage, metadata: { quizId: String(quiz._id) } });

  res.json({
    success: true,
    data: {
      score, total, percentage,
      review: quiz.questions.map((q, i) => ({
        question: q.question,
        selected: answers[i],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
    }
  });
}

export async function getAttempts(req: AuthRequest, res: Response) {
  const data = await QuizAttempt.find({ userId: req.user!.userId }).populate("quizId", "title topic subject").sort({ createdAt: -1 });
  res.json({ success: true, data });
}
