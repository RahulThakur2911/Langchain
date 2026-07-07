import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv"

dotenv.config({});

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenAI({ apiKey });

function getNewYorkTime() {
    const options = { timeZone: "America/New_York", timeStyle: "medium" as const };
    const nyTime = new Date().toLocaleTimeString("en-US", options);
    return { time: nyTime };
}

const timeTool = {
    functionDeclarations: [{
        name: "getNewYorkTime",
        description: "Use this tool to get the current live time of New York city",
        parameters: {
            type: Type.OBJECT,
            properties: {}
        }
    }]
}
const chat = async () => {
    const chatSession = genAI.chats.create({
        model: "gemini-2.5-flash",
        config: {
            tools: [timeTool]
        }
    });

    try {
        console.log("User: what is the current time in newyork.");
        console.log("AI soch raha hai...");

        let response = await chatSession.sendMessage({
            message: "what is the current time in newyork."
        });
        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];

            if (call.name === "getNewYorkTime") {
                console.log(`\n[System]: AI ne tool request kiya -> ${call.name}`);

                const toolResult = getNewYorkTime();
                console.log(`[System]: Local function execution result:`, toolResult);

                response = await chatSession.sendMessage({
                    message: [
                        {
                            functionResponse: {
                                name: "getNewYorkTime",
                                response: toolResult
                            }
                        }
                    ]
                });
            }
        }

        console.log("\nAI Response:", response.text);

    } catch (error) {
        console.error("Chat mein error aayi:", error);
    }
}

chat();