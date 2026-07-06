import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

const googleGenAI = new GoogleGenAI({
    apiKey: "AQ.Ab8RN6Jv4SEl-KAZyjNDJWoM89Ot0gEwDMPRLwPY_BbgdChAsw"
});

const generate   = async () => {
    const res = await googleGenAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Explain how AI works?",

    })
    console.log(res.text);
}

generate();