import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import tutorRoutes from "./routes/tutor.routes";
import documentRoutes from "./routes/document.routes";
import quizRoutes from "./routes/quiz.routes";
import studyRoutes from "./routes/study.routes";
import courseRoutes from "./routes/course.routes";
import progressRoutes from "./routes/progress.routes";
import careerRoutes from "./routes/career.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { notFound, errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(cors({
  origin: env.corsOrigin.split(",").map(x => x.trim()),
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.get("/health", (_req, res) => res.json({
  success: true,
  service: "EduMind AI Backend",
  status: "healthy",
  timestamp: new Date().toISOString()
}));

app.use("/api/auth", authRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(env.port, () => console.log(`EduMind AI backend running on http://localhost:${env.port}`));
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

void start();
