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

/* =========================================================
   CORS CONFIGURATION
   ========================================================= */

// Fixed local development origins
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

// Add any extra origins from .env
const envOrigins = (process.env.CORS_ORIGIN || env.corsOrigin || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allAllowedOrigins = [...new Set([...allowedOrigins, ...envOrigins])];

console.log("Allowed CORS origins:", allAllowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Allow localhost
      if (
        origin === "http://localhost:5173" ||
        origin === "http://127.0.0.1:5173"
      ) {
        return callback(null, true);
      }

      // Allow all Vercel deployment URLs
      // Example:
      // https://aitutor-abc123.vercel.app
      // https://aitutor-xyz456-projects.vercel.app
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Allow origins explicitly specified in .env
      if (allAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  }),
);

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(helmet());

app.use(express.json({ limit: "2mb" }));

app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "EduMind AI Backend",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API ROUTES
   ========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/tutor", tutorRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/study", studyRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/career", careerRoutes);

app.use("/api/dashboard", dashboardRoutes);

/* =========================================================
   ERROR HANDLING
   ========================================================= */

app.use(notFound);

app.use(errorHandler);

/* =========================================================
   START SERVER
   ========================================================= */

async function start() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`EduMind AI backend running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
}

void start();
