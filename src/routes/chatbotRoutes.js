const express = require("express");
const router = express.Router();
const {
    tryChat,
    initChatSession,
    getChatSession,
    addChatItem,
} = require("../controllers/chatbotController.js");

router.post("/tryCareerChat", tryChat);
router.get("/initChatSession", initChatSession);
router.get("/getChatSession/:chatSessionId", getChatSession);
router.post("/addChatItem/:chatSessionId", addChatItem);

module.exports = router;
