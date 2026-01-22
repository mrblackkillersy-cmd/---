const { zokou } = require('../framework/zokou');
const traduire = require("../framework/traduction");
const { default: axios } = require('axios');

// MR BLACK KILLER AI - PRIMARY AI
zokou({
    nomCom: "gpt",
    alias: ["ai", "chat", "ask"],
    reaction: "🤖",
    categorie: "AI"
}, async (dest, zk, commandeOptions) => {

    const { repondre, ms, arg, prefixe } = commandeOptions;

    // Welcome message when no input
    if (!arg[0]) {
        return repondre(`🤖 *AI Assistant*\n\nHi! How can I assist you today? I am AI created by MR BLACK KILLER\n\n📝 *Usage:* ${prefixe}gpt [your question]\n\n*Examples:*\n${prefixe}gpt What is WhatsApp?\n${prefixe}gpt Tell me a joke\n${prefixe}gpt Explain quantum physics`);
    }

    const question = arg.join(" ");

    // Validate question
    if (question.length < 2) {
        return repondre("❌ Please ask a meaningful question (at least 2 characters).");
    }

    try {
        // Show processing message
        await repondre("⏳ Processing your request...");

        // MR BLACK KILLER AI API
        const API_URL = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6aW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==";

        // Make API request
        const response = await axios.post(API_URL, {
            prompt: question
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WhatsApp-Bot-AI/1.0'
            },
            timeout: 50000 // 50 seconds timeout
        });

        // Check response
        if (response.data && response.data.status === "success" && response.data.text) {
            let aiResponse = response.data.text.trim();

            // Handle empty response
            if (!aiResponse) {
                return repondre("⚠️ The AI returned an empty response. Please try a different question.");
            }

            // Trim if too long
            const MAX_LENGTH = 3800;
            if (aiResponse.length > MAX_LENGTH) {
                aiResponse = aiResponse.substring(0, MAX_LENGTH) + "...\n\n📝 *Response truncated*";
            }

            // Format response
            const finalResponse = `🤖 *AI Response*\n\n${aiResponse}\n\n──────────────\n_Powered by MR BLACK KILLER_`;

            return repondre(finalResponse);

        } else {
            // Fallback to old AI if new one fails
            return await fallbackAI(question, repondre);
        }

    } catch (error) {
        console.error("🤖 MR BLACK KILLER AI Error:", error.message);
        
        // Try fallback AI
        try {
            await fallbackAI(question, repondre);
        } catch (fallbackError) {
            // Error messages for primary AI
            let errorMessage = "❌ ";
            
            if (error.code === 'ECONNREFUSED') {
                errorMessage += "Cannot connect to AI service.";
            } else if (error.code === 'ETIMEDOUT') {
                errorMessage += "AI service timeout. Please try again.";
            } else if (error.response?.status === 429) {
                errorMessage += "Too many requests. Please wait.";
            } else {
                errorMessage += "AI service error. Please try again later.";
            }
            
            return repondre(errorMessage);
        }
    }
});

// OLD AI (BACKUP/FALLBACK)
zokou({
    nomCom: "llama",
    alias: ["oldgpt", "brain"],
    reaction: "🧠",
    categorie: "IA"
}, async (dest, zk, commandeOptions) => {

    const { repondre, ms, arg } = commandeOptions;

    if (!arg || !arg[0]) {
        return repondre("🤖 Old AI is listening... Please ask your question.");
    }

    try {
        const message = await traduire(arg.join(' '), { to: 'en' });
        
        const response = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${message}`);
        const data = await response.json();
        
        if (data.cnt) {
            const translatedResponse = await traduire(data.cnt, { to: 'en' });
            repondre(`🧠 Old AI: ${translatedResponse}`);
        } else {
            repondre("❌ Old AI couldn't generate a response.");
        }
    } catch (error) {
        console.error('Old AI Error:', error);
        repondre('❌ Old AI service error.');
    }
});

// HELPER FUNCTION FOR FALLBACK AI
async function fallbackAI(question, repondre) {
    try {
        const message = await traduire(question, { to: 'en' });
        
        const response = await fetch(`https://api.gurusensei.workers.dev/llama?prompt=${message}`);
        const data = await response.json();
        
        if (data.cnt) {
            const translatedResponse = await traduire(data.cnt, { to: 'en' });
            return repondre(`🧠 [Fallback AI] ${translatedResponse}\n\n_Primary AI unavailable, using backup_`);
        } else {
            return repondre("❌ Both AI services are unavailable. Please try again later.");
        }
    } catch (error) {
        throw error; // Re-throw to handle in main catch
    }
}

// AI STATISTICS COMMAND
zokou({
    nomCom: "aistats",
    alias: ["aistat", "aiinfo"],
    reaction: "📊",
    categorie: "IA"
}, async (dest, zk, commandeOptions) => {
    
    const { repondre } = commandeOptions;
    
    const statsMessage = `📊 *AI SYSTEM STATISTICS*\n\n` +
                         `🤖 *Primary AI:* MR BLACK KILLER AI\n` +
                         `🧠 *Backup AI:* Llama AI\n` +
                         `⚡ *Status:* Online\n` +
                         `🔧 *Features:* Auto-fallback system\n` +
                         `🎯 *Commands:* .gpt, .llama, .aistats\n\n` +
                         `_Dual AI system for maximum reliability_`;
    
    return repondre(statsMessage);
});

// CLEAR AI CONTEXT (OPTIONAL)
zokou({
    nomCom: "clearai",
    alias: ["resetai", "newchat"],
    reaction: "🔄",
    categorie: "IA"
}, async (dest, zk, commandeOptions) => {
    
    const { repondre } = commandeOptions;
    
    return repondre("🔄 AI context cleared!\n\nNote: MR BLACK KILLER AI is stateless - each question is independent.");
});
