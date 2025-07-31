import { chatWithDocument } from "../lib/queryUtils";



export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { question } = req.body;
    const answer = await chatWithDocument(question);
    res.status(200).json({ answer });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}