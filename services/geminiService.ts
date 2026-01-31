
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public async getSemanticSearch(query: string, products: Product[]): Promise<string[]> {
    try {
      const productSummary = products.map(p => `${p.id}: ${p.nameEn} / ${p.nameBn} (${p.category})`).join('\n');
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given the query: "${query}", find the most relevant product IDs from this list:\n${productSummary}\nReturn ONLY a JSON array of IDs in order of relevance.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (e) {
      console.error("Gemini Search Error:", e);
      return [];
    }
  }

  public async getAIPersonalizationInsight(userProfile: any, recommendations: Product[]): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User Profile: ${JSON.stringify(userProfile)}
Recommended Products: ${recommendations.map(p => p.nameEn).join(', ')}
Briefly explain in Bangla why these products were chosen for this user. Keep it under 2 sentences.`,
      });
      return response.text || "ব্যক্তিগতকৃত সুপারিশ আপনার পছন্দের ভিত্তিতে তৈরি করা হয়েছে।";
    } catch (e) {
      return "আপনার প্রোফাইল অনুযায়ী সেরা পণ্যগুলো বেছে নেওয়া হয়েছে।";
    }
  }
}
