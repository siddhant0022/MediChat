import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { chatWithDocument } from "../../src/lib/queryUtils";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;
    const answer = await chatWithDocument(question);
    res.json({ answer });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});