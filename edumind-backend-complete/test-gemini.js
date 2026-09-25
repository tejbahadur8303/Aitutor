require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: "Explain recursion in very simple language for a B.Tech CSE student.",
    });

    console.log("\n===== GEMINI RESPONSE =====\n");
    console.log(response.output_text);
    console.log("\n===========================\n");
  } catch (error) {
    console.error("\n===== GEMINI ERROR =====\n");
    console.error(error);
  }
}

testGemini();
