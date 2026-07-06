import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import promptSync from "prompt-sync";
dotenv.config();
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}
const googleGenAI = new GoogleGenAI({ apiKey });
const input = promptSync({ sigint: true });
const startChat = async () => {
    console.log("=== Chat Started! (Type 'exit' to stop the chat) ===\n");
    // 1. generateContent ki jagah chats.create use karo memory ke liye
    const chat = googleGenAI.chats.create({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: "You are a helpful assistant. Always reply in casual Hinglish language, exactly the way Indian users text on WhatsApp (e.g., 'Bhai, mai badhiya hoon, tu bata?'). Do not use pure Hindi fonts or formal English unless explicitly asked."
        }
    });
    // 2. Loop chalao taaki chat continuous chalti rahe
    while (true) {
        const userInput = input("You: ");
        // Agar user 'exit' likhe, to loop tod do aur chat band kar do
        if (userInput?.toLowerCase() === 'exit') {
            console.log("\nAI: Chalo bhai, milte hain baad mein! Bye. 👋");
            break;
        }
        if (!userInput?.trim())
            continue;
        try {
            console.log("AI is typing...");
            // 3. chat.sendMessage purani history ke saath naya message bhejta hai
            const res = await chat.sendMessage({
                message: userInput
            });
            console.log(`\nAI: ${res.text}\n`);
        }
        catch (error) {
            console.error("\n[Error occurred]:", error);
            break;
        }
    }
};
startChat();
//# sourceMappingURL=index.js.map