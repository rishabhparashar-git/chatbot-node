const mongoose = require("mongoose");

// for now we have required for everything as just true only.
// min max validation on number
const FieldSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["text", "select", "number"],
        },
        options: {
            type: [
                {
                    label: String,
                    value: String,
                },
            ],
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
    },
    { _id: false } // Disable _id for events
);

const ChatSessionSchema = new mongoose.Schema(
    {
        fields: [FieldSchema],
        chatItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ChatItem",
            },
        ],
        status: {
            type: String,
            enum: ["ongoing", "completed"],
        },
    },
    { timestamps: true }
);

const ChatSession = mongoose.model("ChatSession", ChatSessionSchema);
module.exports = ChatSession;
