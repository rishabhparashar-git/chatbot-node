const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./src/config/database.js");

// Load env vars
dotenv.config({ path: "./.env" });

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use("/api/chatbot", require("./src/routes/chatbotRoutes.js"));

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(async () => {
    console.log("Connected to database");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
