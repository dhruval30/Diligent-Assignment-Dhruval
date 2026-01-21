const Groq = require('groq-sdk');
const { searchMemory, storeMemory } = require('../utils/memory');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatWithJarvis = async (req, res) => {
    const { message } = req.body;
    let logs = []; // We will collect "thoughts" here

    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
        // STEP 1: Analyze Intent
        logs.push({ step: "Brain", detail: "Analyzing user intent..." });
        
        const intentCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a classifier. If the user input is stating a fact, preference, or piece of information worth remembering (e.g., 'My name is X', 'The code is Y'), respond with just 'STORE'. If it is a question, greeting, or casual chat, respond with 'QUERY'. Output ONLY one word." },
                { role: "user", content: message },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0, 
        });

        const intent = intentCompletion.choices[0]?.message?.content?.trim() || "QUERY";
        logs.push({ step: "Decision", detail: `Intent classified as: ${intent}` });

        let responseText = "";

        // STEP 2: Execute based on Intent
        if (intent.includes("STORE")) {
            // ACTION: Memorize
            logs.push({ step: "Memory", detail: "Encoding and storing information in Vector DB..." });
            await storeMemory(message);
            logs.push({ step: "Success", detail: "Memory block updated." });
            
            // Generate a confirmation
            const confirm = await groq.chat.completions.create({
                messages: [{ role: "user", content: `Acknowledge that you have saved this information: "${message}"` }],
                model: "llama-3.3-70b-versatile",
            });
            responseText = confirm.choices[0]?.message?.content;

        } else {
            // ACTION: Retrieve & Answer
            logs.push({ step: "Memory", detail: "Scanning Vector DB for relevant context..." });
            const context = await searchMemory(message);
            
            if (context) {
                logs.push({ step: "Context", detail: "Found relevant memories." });
            } else {
                logs.push({ step: "Context", detail: "No specific memories found. Using general knowledge." });
            }

            const systemPrompt = `You are Jarvis. Answer the user using this CONTEXT from memory:
            ${context || "No memory found."}
            If the context isn't useful, answer naturally.`;

            logs.push({ step: "Generation", detail: "Synthesizing response..." });
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message },
                ],
                model: "llama-3.3-70b-versatile",
            });
            responseText = chatCompletion.choices[0]?.message?.content;
        }

        // Return Answer AND Logs
        res.json({ response: responseText, logs: logs });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { chatWithJarvis };