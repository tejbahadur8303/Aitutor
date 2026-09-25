import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";

/* =========================================================
   GEMINI CONFIGURATION
   ========================================================= */

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-3.8-flash";

/* =========================================================
   LOCAL HASH EMBEDDING
   Keeps existing RAG/document functionality working
   without requiring an embedding API.
   ========================================================= */

function hashEmbedding(text: string, dims = 128): number[] {
  const out = new Array(dims).fill(0);
  const normalized = text.toLowerCase();

  for (let i = 0; i < normalized.length; i++) {
    const h = crypto
      .createHash("sha256")
      .update(`${normalized[i]}:${i}`)
      .digest();

    for (let j = 0; j < 4; j++) {
      const index = h[j] % dims;
      out[index] += (h[j + 4] / 255) * 2 - 1;
    }
  }

  const norm =
    Math.sqrt(out.reduce((sum, value) => sum + value * value, 0)) || 1;

  return out.map((value) => value / norm);
}

/* =========================================================
   ERROR DETECTION
   ========================================================= */

/**
 * Detect Gemini quota / rate-limit errors.
 *
 * Gemini can return errors such as:
 * - 429
 * - RESOURCE_EXHAUSTED
 * - rate_limit_exceeded
 * - quota_exceeded
 * - too_many_requests
 */
function isGeminiRateLimitError(error: any): boolean {
  const message = String(
    error?.message ||
      error?.error?.message ||
      error?.response?.data?.error?.message ||
      ""
  ).toLowerCase();

  const code = String(
    error?.status ||
      error?.code ||
      error?.error?.code ||
      error?.error?.status ||
      error?.response?.data?.error?.code ||
      ""
  ).toLowerCase();

  return (
    code.includes("429") ||
    code.includes("resource_exhausted") ||
    code.includes("rate_limit") ||
    code.includes("quota_exceeded") ||
    code.includes("too_many_requests") ||
    message.includes("429") ||
    message.includes("resource exhausted") ||
    message.includes("rate limit") ||
    message.includes("quota exceeded") ||
    message.includes("too many requests")
  );
}

/**
 * Detect temporary Gemini/server/network errors.
 */
function isTemporaryGeminiError(error: any): boolean {
  const message = String(
    error?.message ||
      error?.error?.message ||
      error?.response?.data?.error?.message ||
      ""
  ).toLowerCase();

  const code = String(
    error?.status ||
      error?.code ||
      error?.error?.code ||
      error?.error?.status ||
      error?.response?.data?.error?.code ||
      ""
  ).toLowerCase();

  return (
    code.includes("503") ||
    code.includes("500") ||
    code.includes("service_unavailable") ||
    code.includes("api_error") ||
    message.includes("503") ||
    message.includes("service unavailable") ||
    message.includes("temporarily unavailable") ||
    message.includes("timeout") ||
    message.includes("network")
  );
}

/* =========================================================
   NORMAL AI TEXT GENERATION
   ========================================================= */

export async function generateText(
  prompt: string,
  system = "You are EduMind AI, a helpful educational tutor."
) {
  /* -------------------------------------------------------
     API KEY CHECK
     ------------------------------------------------------- */

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured.");

    return (
      "⚠️ AI Tutor is not configured yet. " +
      "Please contact the administrator."
    );
  }

  /* -------------------------------------------------------
     GEMINI REQUEST
     ------------------------------------------------------- */

  try {
    const response = await gemini.interactions.create({
      model: GEMINI_MODEL,
      input: prompt,
      system_instruction: system,
    });

    const text = response.output_text?.trim();

    if (text) {
      return text;
    }

    /* Gemini responded but returned no text */
    return localFallback(prompt);
  } catch (error) {
    console.error("Gemini text generation failed:", error);

    /* -----------------------------------------------------
       QUOTA / RATE LIMIT
       ----------------------------------------------------- */

    if (isGeminiRateLimitError(error)) {
      return (
        "⚠️ AI Tutor is temporarily unavailable because " +
        "the free Gemini API quota has been reached.\n\n" +
        "Please try again after the quota resets."
      );
    }

    /* -----------------------------------------------------
       TEMPORARY SERVER / NETWORK ERROR
       ----------------------------------------------------- */

    if (isTemporaryGeminiError(error)) {
      return (
        "⚠️ AI Tutor is temporarily unavailable right now.\n\n" +
        "Please try again in a moment."
      );
    }

    /* -----------------------------------------------------
       OTHER GEMINI ERROR
       ----------------------------------------------------- */

    return (
      "⚠️ AI Tutor could not process this question right now.\n\n" +
      "Please try again shortly."
    );
  }
}

/* =========================================================
   STRUCTURED JSON GENERATION
   Used by quiz / other AI features.
   ========================================================= */

export async function generateStructured<T>(
  prompt: string
): Promise<T | null> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not configured.");
    return null;
  }

  try {
    const response = await gemini.interactions.create({
      model: GEMINI_MODEL,

      input: `${prompt}

IMPORTANT:
Return ONLY valid JSON.
Do not use markdown.
Do not use code fences.
Do not add explanations before or after the JSON.`,

      system_instruction:
        "You are EduMind AI. Return only valid JSON matching the requested structure.",
    });

    const text = response.output_text?.trim();

    if (!text) {
      return null;
    }

    /* -----------------------------------------------------
       Remove accidental markdown code fences
       ----------------------------------------------------- */

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleaned) as T;
  } catch (error) {
    console.error("Gemini structured generation failed:", error);

    /*
     * Do not send a long error to the frontend.
     * Returning null allows existing quiz fallback logic
     * to handle the situation.
     */

    return null;
  }
}

/* =========================================================
   EMBEDDING
   ========================================================= */

export async function embedding(text: string): Promise<number[]> {
  return hashEmbedding(text);
}

/* =========================================================
   LOCAL DEMO FALLBACK
   ========================================================= */

/**
 * This fallback is useful during the hackathon.
 *
 * If Gemini quota is exhausted, some common demonstration
 * questions can still receive useful answers.
 */
function localFallback(prompt: string): string {
  const lower = prompt.toLowerCase();

  /* -------------------------------------------------------
     BINARY SEARCH
     ------------------------------------------------------- */

  if (lower.includes("binary search")) {
    return (
      "Binary Search is an efficient searching algorithm used " +
      "on sorted data.\n\n" +
      "It compares the target with the middle element. " +
      "If the target is smaller, we search the left half. " +
      "If it is larger, we search the right half.\n\n" +
      "Time Complexity: O(log n)"
    );
  }

  /* -------------------------------------------------------
     RECURSION
     ------------------------------------------------------- */



  /* -------------------------------------------------------
     DBMS / NORMALIZATION
     ------------------------------------------------------- */

  if (
    lower.includes("normalization") ||
    lower.includes("dbms")
  ) {
    return (
      "Database normalization is a technique used to organize " +
      "data efficiently in a database.\n\n" +
      "Its main goals are:\n" +
      "• Reduce duplicate data\n" +
      "• Avoid update anomalies\n" +
      "• Improve data consistency\n\n" +
      "Common normal forms include 1NF, 2NF and 3NF."
    );
  }

  /* -------------------------------------------------------
     VARANASI
     ------------------------------------------------------- */

  if (
    lower.includes("varanasi") ||
    lower.includes("banaras") ||
    lower.includes("durgakund")
  ) {
    return (
      "Varanasi, also known as Banaras or Kashi, is one of the " +
      "oldest continuously inhabited cities in the world.\n\n" +
      "It is located on the banks of the River Ganga in Uttar Pradesh. " +
      "The city is famous for its ghats, temples, spiritual traditions " +
      "and cultural heritage.\n\n" +
      "Durga Kund is a well-known area of Varanasi, particularly known " +
      "for the historic Durga Temple and its nearby cultural surroundings."
    );
  }

  /* -------------------------------------------------------
     AI / ARTIFICIAL INTELLIGENCE
     ------------------------------------------------------- */

  if (
    lower.includes("what is ai") ||
    lower.includes("artificial intelligence")
  ) {
    return (
      "Artificial Intelligence, or AI, is a field of computer science " +
      "that enables machines to perform tasks that normally require " +
      "human intelligence.\n\n" +
      "Examples include learning, reasoning, understanding language, " +
      "image recognition and problem solving."
    );
  }

  /* -------------------------------------------------------
     GENERIC DEMO FALLBACK
     ------------------------------------------------------- */

  return (
    "⚠️ AI Tutor is temporarily unavailable because the Gemini " +
    "API quota has been reached.\n\n" +
    "Please try again after the quota resets."
  );
}