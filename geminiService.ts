
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBio = async (interests: string[], name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a charming, authentic Burundian dating bio for someone named ${name} who likes ${interests.join(', ')}. Keep it warm, use a bit of Kirundi if appropriate (like 'Amahoro'), and make it engaging.`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 150,
      }
    });
    return response.text || "I'm looking for someone special to share life's adventures with.";
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Looking for a meaningful connection in Burundi.";
  }
};

export const getConversationStarter = async (partnerName: string, partnerInterests: string[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a creative and respectful first message for a dating app. The person's name is ${partnerName} and they like ${partnerInterests.join(', ')}. The context is Burundi (Bujumbura/Gitega).`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
      }
    });
    return response.text || "Hello! I saw your profile and thought we might have some things in common.";
  } catch (error) {
    console.error("Error generating starter:", error);
    return "Hi there! How is your day going?";
  }
};
