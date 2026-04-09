export default async function handler(req, res) {

  // ✅ Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "API key not set" });
    }

    const { message, history, system } = req.body;

    const messages = [
      { role: "system", content: system || "You are a helpful AI assistant." },
      ...(history || []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: messages
      })
    });

    const data = await response.json();

    if (!data.choices) {
  return res.status(500).json({ error: "No response from AI", full: data });
}

res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
