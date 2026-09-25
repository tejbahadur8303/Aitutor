# EduMind AI Backend

Complete backend for the EduMind AI React frontend.

## Features

- JWT registration/login/me
- AI Tutor with conversation history
- Document PDF upload, text extraction, chunking and semantic retrieval
- OpenAI chat + embeddings when `OPENAI_API_KEY` is configured
- Local deterministic AI/embedding fallback when no OpenAI key is available
- Quiz generation and quiz attempt recording
- Study planner CRUD
- Progress/analytics endpoints
- Courses and enrollment
- Career guidance
- Profile update
- Dashboard summary
- MongoDB persistence
- Security middleware, validation, rate limiting and error handling

## Run

1. Start MongoDB locally or use MongoDB Atlas.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI`.
4. Optional: set `OPENAI_API_KEY`.
5. Install:
   npm install
6. Seed:
   npm run seed
7. Start:
   npm run dev

Backend: http://localhost:5001
API: http://localhost:5001/api
Health: http://localhost:5001/health

Demo student:
email: student@edumind.ai
password: demo123
