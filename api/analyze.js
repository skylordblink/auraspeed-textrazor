import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.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, // Your OpenAI API key in environment variables
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
"${text}"

Break it down into:
1. Key Elements / Themes
2. Suggested Video Titles
3. Recommended Tags (max 10, lowercase, no emojis)
4. Tone of the Content
5. One-paragraph Summary
6. Optional Suggestions to Improve the Content
7. Emotion Triggered (Fear, Awe, Curiosity, etc.)

Respond clearly, use simple structure, and avoid sounding like AI. Speak like a human strategist.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Or your preferred model
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const responseText = completion.choices[0].message.content;

    return res.status(200).json({ result: responseText });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
