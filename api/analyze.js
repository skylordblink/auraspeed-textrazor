export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const text = req.body.text;
  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await fetch("https://api.textrazor.com/", {
      method: "POST",
      headers: {
        "x-textrazor-key": process.env.TEXTRAZOR_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        extractors: "entities,topics,sentiment",
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
