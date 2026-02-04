import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Google Gemini AI configuration
 */

// Validate environment variable
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️  GEMINI_API_KEY não está configurada. " +
    "A categorização automática de transações não funcionará. " +
    "Obtenha sua chave gratuita em: https://makersuite.google.com/app/apikey"
  );
}

// Initialize Gemini client (only if API key is available)
export const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Model configuration
export const GEMINI_CONFIG = {
  // Use gemini-1.5-flash for free tier (15 req/min, 1M tokens/day)
  model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  
  // Generation config for consistent categorization
  generationConfig: {
    temperature: 0, // Deterministic responses
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 500,
  },
  
  // Safety settings (allow all for categorization task)
  safetySettings: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_NONE",
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ],
} as const;

/**
 * Check if AI categorization is available
 */
export function isAICategorizationAvailable(): boolean {
  return genAI !== null;
}
