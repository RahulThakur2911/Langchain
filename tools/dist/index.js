"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({});
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not defined in environment variables");
}
const genAI = new genai_1.GoogleGenAI({ apiKey });
function getNewYorkTime() {
    const options = { timeZone: "America/New_York", timeStyle: "medium" };
    const nyTime = new Date().toLocaleTimeString("en-US", options);
    return { time: nyTime };
}
const timeTool = {
    functionDeclarations: [{
            name: "getNewYorkTime",
            description: "Use this tool to get the current live time of New York city",
            parameters: {
                type: genai_1.Type.OBJECT,
                properties: {}
            }
        }]
};
const chat = () => __awaiter(void 0, void 0, void 0, function* () {
    const chatSession = genAI.chats.create({
        model: "gemini-2.5-flash",
        config: {
            tools: [timeTool]
        }
    });
    try {
        console.log("User: what is the current time in newyork.");
        console.log("AI soch raha hai...");
        let response = yield chatSession.sendMessage({
            message: "what is the current time in newyork."
        });
        if (response.functionCalls && response.functionCalls.length > 0) {
            const call = response.functionCalls[0];
            if (call.name === "getNewYorkTime") {
                console.log(`\n[System]: AI ne tool request kiya -> ${call.name}`);
                const toolResult = getNewYorkTime();
                console.log(`[System]: Local function execution result:`, toolResult);
                response = yield chatSession.sendMessage({
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
    }
    catch (error) {
        console.error("Chat mein error aayi:", error);
    }
});
chat();
