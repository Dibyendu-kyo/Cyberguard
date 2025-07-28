import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

console.log("Loaded Gemini API Key:", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default gemini;
