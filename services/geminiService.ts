
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerAnalysisResult, ChatMessage } from "../types";

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallSummary: { type: Type.STRING },
    evaluation: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        atsKeywords: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              keyword: { type: Type.STRING },
              present: { type: Type.BOOLEAN }
            },
            required: ["keyword", "present"]
          }
        },
        impactScores: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              metric: { type: Type.STRING },
              score: { type: Type.NUMBER },
              feedback: { type: Type.STRING }
            },
            required: ["metric", "score", "feedback"]
          }
        },
        fixSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["score", "atsKeywords", "impactScores", "fixSuggestions"]
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING },
          importance: { type: Type.NUMBER }
        },
        required: ["name", "category", "importance"]
      }
    },
    careerPaths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          marketTrend2026: { type: Type.STRING },
          salaryRange: { type: Type.STRING }
        },
        required: ["title", "description", "marketTrend2026", "salaryRange"]
      }
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        // Fixed: Items in the roadmap array are objects containing week, topic, and tasks
        type: Type.OBJECT,
        properties: {
          week: { type: Type.NUMBER },
          topic: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["week", "topic", "tasks"]
      }
    }
  },
  required: ["overallSummary", "evaluation", "skills", "careerPaths", "roadmap"]
};

export const analyzeCareer = async (profile: UserProfile): Promise<CareerAnalysisResult> => {
  // Correctly using process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are VidyaGuide AI, an expert Career Mentor. Analyze this profile: Role: ${profile.targetRole}, Level: ${profile.experienceLevel}, Resume: ${profile.resumeText}. Perform forensic evaluation, map skills for 2026, suggest 3 paths, and a 4-week roadmap.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: ANALYSIS_SCHEMA as any,
      },
    });
    // Use the .text property directly as per guidelines
    return JSON.parse(response.text!) as CareerAnalysisResult;
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) throw new Error("API_KEY_NOT_FOUND");
    throw error;
  }
};

export const chatWithMentor = async (message: string, history: ChatMessage[]): Promise<ChatMessage> => {
  // Initialize AI client right before use to ensure updated API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [
      ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are VidyaGuide AI Mentor. Provide data-driven career advice using Google Search for real-time market trends, company news, and hiring updates. Be concise and professional."
    }
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({ title: chunk.web!.title, uri: chunk.web!.uri })) || [];

  return {
    role: 'model',
    text: response.text || "I'm having trouble retrieving that information right now.",
    sources: sources.length > 0 ? sources : undefined
  };
};

export const optimizeBullet = async (bullet: string, role: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Rewrite this resume bullet point for a ${role} position to be more impactful, using the 'Action + Context + Result' framework and including quantifiable metrics. Original: "${bullet}"`,
  });
  return response.text || bullet;
};
