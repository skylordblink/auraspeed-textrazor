import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "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"
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

Break it down into a JSON object with the following keys:
1. keyElements: list of key elements or themes
2. suggestedTitles: list of suggested video titles
3. recommendedTags: list of max 10 tags, lowercase, no emojis
4. tone: tone of the content
5. summary: one-paragraph summary
6. suggestions: optional suggestions to improve the content
7. emotion: main emotion triggered (fear, awe, curiosity, etc.)

Respond only with valid JSON matching this structure, no extra commentary.
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
