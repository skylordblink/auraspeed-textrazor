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
        // 🔐 Your actual API key added here
        "x-textrazor-key": "aa8c880dc80ee0e5f1d7c585009937e16171769efcded85c6be0ee0b",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text,
        extractors: "entities",
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
