import { chatWithDocument } from "../lib/queryUtils";


import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { question } = req.body;
    const answer = await chatWithDocument(question);
    res.status(200).json({ answer });
  } catch (err) {
    console.error("API error:", err);
    const errorMessage = typeof err === "object" && err !== null && "message" in err
      ? (err as { message?: string }).message
      : undefined;
    res.status(500).json({ error: errorMessage || "Internal server error" });
  }
}