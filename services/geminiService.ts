
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, CareerAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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
  const prompt = `
    You are VidyaGuide AI, an expert Career Mentor and Resume Strategist.
    Analyze the following profile and resume text:
    
    Target Role: ${profile.targetRole}
    Experience Level: ${profile.experienceLevel}
    Resume Content: ${profile.resumeText}
    
    Tasks:
    1. Evaluate the resume (0-100) based on Quantifiable Impact and ATS compatibility.
    2. Analyze skills (Hard, Soft, and Missing Link) relative to the target role.
    3. Suggest 3 career paths considering 2026 market trends.
    4. Create a 4-week learning roadmap with specific tasks.
    
    Ensure the feedback is brutally honest yet encouraging. Be specific with industry standards (e.g., specific libraries, methodologies).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: ANALYSIS_SCHEMA as any,
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  return JSON.parse(text) as CareerAnalysisResult;
};
