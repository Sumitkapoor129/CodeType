import api from './api';
import { CodingLanguage, SnippetResponse } from "../types";


export const fetchCodeSnippet = async (language: CodingLanguage): Promise<SnippetResponse> => {
  try {
    const response = await api.get<SnippetResponse>('api/snippets/random', {
      params: { language }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch snippet from backend", error);
    // Fallback for when backend is offline
    return {
      code: `// Error connecting to backend.\n// Ensure server is running at http://localhost:5000\n\nfunction hello() {\n  console.log("Hello World");\n}`,
      language
    };
  }
};


export const fetchFeedback = async (mistakes: number, wpm: number, accuracy: number): Promise<string> => {
    // Generate simple local feedback or hit an endpoint if exists
    if (accuracy >= 98 && wpm > 60) return "Outstanding! You're coding at the speed of thought.";
    if (accuracy >= 95) return "Great accuracy! Speed will come naturally.";
    if (wpm > 80 && accuracy < 90) return "Fast, but focus on precision.";
    if (mistakes > 10) return "Too many bugs in this run! Slow down.";
    return "Good effort. Keep practicing!";
};
