const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function aiChat({
    input,
    instructions,
    effort,
    reasoningContext = "all_turns",
    previousResponseId,
}) {
    return await openai.responses.create({
        model: "gpt-5.6-luna",
        ...(instructions && { instructions }),
        input,
        reasoning: { ...(effort && { effort }), context: reasoningContext },
        ...(previousResponseId && { previous_response_id: previousResponseId }),
        stream: true,
    });
}

module.exports = { aiChat };
