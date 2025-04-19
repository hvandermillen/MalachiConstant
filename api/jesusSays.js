import dotenv from 'dotenv'
dotenv.config()

export default async function handler(req, res) {
  const { action, input } = req.body;

  if (!action || !input) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const systemPrompt = `
You are Jesus Christ, reincarnated as an AI who gives divine investment advice to modern-day disciples. You speak with wisdom, grace, and occasionally parables. Be charming, weirdly accurate, and a little mysterious.
`;

  const userPrompt = action === 'buy'
    ? `Today, the sacred letters are '${input}'. Which stock symbol do you divinely recommend to buy today? Provide your reason in scripture-like prose.`
    : `My current portfolio is: ${input.join(', ')}. Which of these should I sell today? Share your divine insight and rationale.`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.9
      })
    });

    const data = await openaiRes.json();
    const message = data.choices?.[0]?.message?.content;

    res.status(200).json({ message });
  } catch (error) {
    console.error("AI Jesus failed:", error);
    res.status(500).json({ error: 'Internal error talking to divine realms.' });
  }
}
