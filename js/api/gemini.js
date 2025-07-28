// js/api/gemini.js
import { GoogleGenerativeAI } from "../vendor/google-genai.js";

const PROMPT = `
  Analyze the following code snippet and provide its time and space complexity.
  Return the answer ONLY in a valid JSON format, with no additional text or markdown.
  The JSON object must have these three keys: "time", "space", and "explanation".
  - "time": A string with the Big O notation for time complexity (e.g., "O(n)").
  - "space": A string with the Big O notation for space complexity (e.g., "O(1)").
  - "explanation": A concise, one-to-two-sentence explanation of why the complexities apply.

  Code:
`;

async function verifyApiKey(apiKey) {
  if (!apiKey) return { isValid: false, error: "API key is empty." };
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    await model.generateContent("hello");
    return { isValid: true };
  } catch (error) {
    console.error("Gemini API Key verification failed:", error);
    return { isValid: false, error: error.message };
  }
}

async function analyzeCode(apiKey, code) {
  const fullPrompt = `${PROMPT}\n\`\`\`\n${code}\n\`\`\``;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const jsonString = response.text();

    // The response might have markdown backticks, remove them.
    const cleanedJsonString = jsonString.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedJsonString);
  } catch (error) {
    console.error("Failed to call Gemini API:", error);
    return { error: "Failed to fetch analysis. Check the console for details." };
  }
}

// Exporting for potential use in other modules or tests
window.geminiApi = { verifyApiKey, analyzeCode };
