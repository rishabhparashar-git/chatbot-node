const _ = require("lodash")
const { OpenAI } = require("openai");
const ChatBotData = require("./ChatBotData.json");

// Correct instantiation of the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const sendToOpenAi =async (input)=> {
    
    const messages = _.cloneDeep(input)

    if (!Array.isArray(messages) || !messages.length) {
        throw new Error("Messages must be an array of message objects");
    }


    const response =   await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
    });

    let gptMessage = {
        role: "assistant",
        content: response.choices[0].message.content,
    };

    messages.push(gptMessage)

    return messages

}

const template_CareerGPT = {
    model: "gpt-3.5-turbo",
    messages: [
        {
            role: "system",
            content: `Assume that you're a career counsellor, and helping user in deciding their graduation stream. You need to first greet and then start asking questions in order to gather all the required information, and than based on their interests and geographic location and the location they want to pursue their study at you need to suggest them a course. Make sure you ask one question at a time, keeping a friendly tone making the user comfortable and not intimidated.`,
        },
    ],
};

// Function to pass extracted text to GPT for processing
async function chatWithCareerGPT(message) {
    console.log("<======all messages start======>");

    template_CareerGPT.messages.forEach((msg) => {
        console.log(msg.content);
    });

    console.log("<======all messages finish======>");

    // if not the first message then add it to the messages array
    if (template_CareerGPT.messages.length !== 1) {
        template_CareerGPT.messages.push({ role: "user", content: message });
    }

    const response = await openai.chat.completions.create(template_CareerGPT);
    let GPTresult = response.choices[0].message.content;
    template_CareerGPT.messages.push({ role: "assistant", content: GPTresult });

    return template_CareerGPT.messages;
}

async function initChatBot(fields) {
    // ask not to exploit the value of options
    // don't force users to reply exact same value
    const initial_messages = [
        {
            role: "system",
            content: ChatBotData.startingPrompt,
        },
        {
            role: "system",
            content: JSON.stringify(ChatBotData.fieldSchema),
        },
        {
            role: "system",
            content: JSON.stringify(fields),
        },
    ];
    const currentConversation = await sendToOpenAi(initial_messages);
    return currentConversation
}

async function addMessageToChat(chatHistory, newItem){
    const allMessages = _.cloneDeep(chatHistory.concat(newItem));
    const currentConversation = await sendToOpenAi(allMessages);
    return currentConversation
}

exports.addMessageToChat = addMessageToChat;
exports.initChatBot = initChatBot;
exports.chatWithCareerGPT = chatWithCareerGPT;
