export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const prompt = `Rewrite the following content in a clear, natural, human tone. Do not make it sound robotic or overly polished. Maintain the original meaning but make it more concise, impactful, and easy to read:\n\n"${text}"`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const json = await openaiRes.json();

    if (!openaiRes.ok) {
      return res.status(openaiRes.status).json({ error: json.error?.message || "OpenAI API error" });
    }

    const improved = json.choices?.[0]?.message?.content || "No response";

    return res.status(200).json({ ok: true, result: improved });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
