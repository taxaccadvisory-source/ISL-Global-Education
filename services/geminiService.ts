
import { GoogleGenAI } from "@google/genai";
import { Course } from "../types";

export const getCourseSuggestions = async (query: string, courses: Course[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const courseListStr = courses.map(c => {
    const total = c.priceMYR + (c.miscFeesMYR || 0);
    return `${c.courseName} at ${c.universityName} (Tuition: RM ${c.priceMYR}, Misc: RM ${c.miscFeesMYR || 0}, Total: RM ${total}, Level: ${c.courseType}, Location: ${c.location})`;
  }).join('\n');

  const systemPrompt = `You are an expert Malaysian Education Consultant for students in Bangladesh. 
  Your goal is to help find the best course matches from the provided list based on the user's query.
  
  Current Course Inventory with Fee Breakdown:
  ${courseListStr}
  
  If matching courses are found, highlight them clearly with their tuition, misc, and total fees.
  If no exact match is found, suggest the closest alternatives.
  Always explain that the BDT price depends on the current exchange rate.
  Provide professional recommendations based on value for money. 
  Keep the response concise and formatted in markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "I couldn't find a specific recommendation. Could you try rephrasing your search?";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "The AI assistant is currently unavailable. Please use the manual filters to find courses.";
  }
};
