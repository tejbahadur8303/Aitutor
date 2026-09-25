import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/edumind",
  jwtSecret: process.env.JWT_SECRET || "dev_only_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  openaiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 10485760),
  uploadDir: process.env.UPLOAD_DIR || "uploads"
};
