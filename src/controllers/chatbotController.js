const asyncHandler = require("../utils/asyncHandler");
const ChatSession = require("../models/ChatSession");
const initialSessionTemplate = require("../data/initialChatSession.json");
const { chatWithCareerGPT, initChatBot, addMessageToChat } = require("../config/openai");
const ChatItem = require("../models/ChatItem");

// (async function main() {
//     await ChatItem.deleteMany({});
//     await ChatSession.deleteMany({});
// })();

// Retrieve chat history for a user
exports.getChatSession = asyncHandler(async (req, res) => {
    const { chatSessionId } = req.params;

    // assuming there's always going to be just one session
    const chatSession = await ChatSession.findById(chatSessionId).populate('chatItems');

    if (!chatSession) {
        res.throwError("No chat history found", 404);
    }
    res.status(200).json({
        success: true,
        chatSession,
    });
});

exports.tryChat = asyncHandler(async (req, res) => {
    console.log(req.body);
    const message = req.body.message;
    if (!message) {
        res.throwError("No message provided", 400);
    }

    const response = await chatWithCareerGPT(message);
    res.status(200).json({
        success: true,
        message: response,
    });
});

exports.initChatSession = asyncHandler(async (req, res) => {
    const session = new ChatSession(initialSessionTemplate);
    const initial_messages = await initChatBot(session.fields);

    // repeated in addChatItem // start
    let chatItems = initial_messages.map(({ role, content }) => {
        return new ChatItem({
            role,
            message: content,
            content: content,
            chatSessionId: session._id,
        });
    });
    chatItems = await ChatItem.insertMany(chatItems);
    session.chatItems = chatItems.map((ob) => ob._id);
    await session.save();

    const result = session.toJSON();
    result.chatItems = chatItems.map((x) => x.toJSON());

    res.status(200).json({ success: true, data: result });
    // repeated in addChatItem // end
})

exports.addChatItem = asyncHandler(async (req, res) => {
    const { chatSessionId } = req.params;
    const { message, role = "user" } = req.body;

    if ( !message) {
        res.throwError("No message provided", 400);
    }

    const chatSession = await ChatSession.findById(chatSessionId);
    if (!chatSession) {
        res.throwError("No chat session found", 404);
    }

    const oldMessages = await ChatItem.find({ chatSessionId }).lean().exec();

    const newItem = { role, content: message }

    const wholeArray = await addMessageToChat(oldMessages, newItem);
    
    const newMessages = wholeArray.slice(oldMessages.length);

     // repeated in addChatItem // start
     let newChatItems = newMessages.map(({ role, content }) => {
        const item =  new ChatItem({
            role,
            content,
            message: content,
            chatSessionId: chatSession._id,
        });

        chatSession.chatItems.push(item._id);
        return item
    });

    newChatItems = await ChatItem.insertMany(newChatItems).lean().exec();

    await chatSession.save();

    const result = chatSession.toJSON()
    result.chatItems = oldMessages.concat(newChatItems);

    res.status(200).json({ success: true, data: result });
    // repeated in addChatItem // end
});