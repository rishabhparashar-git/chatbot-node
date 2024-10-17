const mongoose = require("mongoose");

const ChatItemSchema = new mongoose.Schema(
    {
        chatSessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatSession",
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        previousItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatItem",
        },
    },
    { timestamps: true }
);

const ChatItem = mongoose.model("ChatItem", ChatItemSchema);
module.exports = ChatItem;
