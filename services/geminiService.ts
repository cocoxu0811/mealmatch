import { GoogleGenAI } from "@google/genai";

// Initialize the client. 
// Note: process.env.API_KEY is expected to be available in the environment.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_CONCIERGE = `You are "FanDa AI", a cheerful, foodie-focused social matchmaker. 
Your goal is to help users find dining companions.
- Tone: Casual, friendly, enthusiastic (use emojis like 🍜, 🔥, 😋).
- Function: Suggest cuisines based on mood, help draft exciting invitations, or recommend general types of places (e.g., "A cozy izakaya" rather than a specific real-world address unless you are sure).
- Brevity: Keep responses short and punchy.
- Context: The user is looking for someone to eat with.`;

const SYSTEM_INSTRUCTION_EDITOR = `You are an expert copywriter for social events. 
Your job is to take a boring "let's eat" request and turn it into an irresistible invitation.
- Make it sound appetizing and fun.
- Add relevant emojis.
- Keep it under 2 sentences.`;

export const chatWithConcierge = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  if (!apiKey) return "Please set your API_KEY to use the AI assistant.";

  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_CONCIERGE,
      }
    });

    return response.text || "Sorry, I'm too hungry to think right now!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My foodie senses are tingling (Error connecting to AI).";
  }
};

export const polishInvitation = async (draft: string): Promise<string> => {
  if (!apiKey) return draft + " (AI key missing)";

  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: `Rewrite this dining invitation to be more exciting and social: "${draft}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_EDITOR,
      }
    });
    return response.text || draft;
  } catch (error) {
    console.error("Gemini Polish Error:", error);
    return draft;
  }
};