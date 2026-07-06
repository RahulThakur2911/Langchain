import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"

dotenv.config();

const googleGenAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});

async function run() {
    const response = await googleGenAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works?",
        // config: {
        //     temperature: 0.7,
        //     maxOutputTokens: 500,
        // }
    });
    console.log(response.text);
}

run();
