import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // <-- securely read from Vercel env vars or .env.local
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  const prompt = `
You're an AI YouTube strategist. A user pasted this content:
"""${text}"""

Break it down into a JSON object exactly matching this format (no extra text or explanation):

{
  "keyElements": [string],
  "suggestedTitles": [string],
  "recommendedTags": [string],
  "tone": string,
  "summary": string,
  "suggestions": string,
  "emotion": string
}

ONLY output this JSON object, nothing else.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rawResponse = completion.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(rawResponse);
    } catch {
      return res.status(500).json({
        error: "Failed to parse AI response as JSON",
        rawResponse,
      });
    }

    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
