import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { generateQuiz, getQuizzes, getQuiz, submitQuiz, getAttempts } from "../controllers/quiz.controller";

const router = Router();
router.use(authenticate);
router.post("/generate", generateQuiz);
router.get("/", getQuizzes);
router.get("/attempts", getAttempts);
router.get("/:id", getQuiz);
router.post("/:id/submit", submitQuiz);
export default router;
