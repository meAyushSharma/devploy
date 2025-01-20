const OpenAI = require("openai");

const AI_MODEL = "codellama-70b";
const AI_API_KEY = process.env.AI_API_KEY;

const AI_CLIENT = new OpenAI({
    apiKey: AI_API_KEY,
    baseURL: process.env.BASE_URL,
});

const generatePrompt = (query) => {
    const prompt = `you are to answer the following query under these conditions, first query should only be about docker technology if it is not about docker technology then simply answer with a random fact about docker and do not answer anything else, second reply format should be statements first and code after it.\n
    The query consists of conversation thread between the "user" and "assistant" that is you, and you are to answer in the given context of conversation, while adhering the conditions mentioned before.
    The query is this : ${JSON.stringify(query)}`;
    return prompt;
}

module.exports.getChatReply = async (PROMPT) => {
    const prompt = generatePrompt(PROMPT);
    console.log("this is prompt:     ", prompt)
    const chatCompletion = await AI_CLIENT.chat.completions.create({
      messages: [{ role: "assistant", content: prompt }],
      model: AI_MODEL,
    });
    const content = chatCompletion.choices[0]?.message?.content?? "";
    console.log(`the content from ai is::: \n ${content}`);
    return content;
};