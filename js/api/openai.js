// js/api/openai.js

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `
  You are a code analysis expert. Analyze the user's code snippet for time and space complexity.
  Return the answer ONLY in a valid JSON format, with no additional text or markdown.
  The JSON object must have these three keys: "time", "space", and "explanation".
  - "time": A string with the Big O notation for time complexity (e.g., "O(n)").
  - "space": A string with the Big O notation for space complexity (e.g., "O(1)").
  - "explanation": A concise, one-to-two-sentence explanation of why the complexities apply.
`;

async function verifyApiKey(apiKey) {
  if (!apiKey) return { isValid: false, error: "API key is empty." };
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (response.ok) {
        return { isValid: true };
    }
    const errorBody = await response.json();
    const message = errorBody.error?.message || `HTTP Error: ${response.status}`;
    return { isValid: false, error: message };
  } catch (error) {
    console.error("OpenAI API Key verification failed:", error);
    return { isValid: false, error: "A network error occurred. This might be a CORS issue if host permissions are missing." };
  }
}

async function analyzeCode(apiKey, code) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo-1106', // Using a model that supports JSON mode
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: code }
        ]
      })
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("OpenAI API Error:", errorBody.error.message);
      return { error: `OpenAI API Error: ${errorBody.error.message}` };
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return JSON.parse(data.choices[0].message.content);
    } else {
        return { error: "No valid response from OpenAI API." };
    }
  } catch (error) {
    console.error("Failed to call OpenAI API:", error);
    return { error: "Failed to fetch analysis. Check the console for details." };
  }
}

window.openaiApi = { verifyApiKey, analyzeCode };
