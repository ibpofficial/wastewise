// server.js - simple proxy server to keep your OPENROUTER_API_KEY secret
// Usage:
//    npm install
//    OPENROUTER_API_KEY=your_key_here node server.js
//
// When deploying to GitHub, add OPENROUTER_API_KEY to GitHub Secrets and set it in the environment during deployment.

const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 or v3 depending on environment
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Endpoint the client calls
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server not configured with OPENROUTER_API_KEY' });
  }

  // Build the prompt based on client payload
  const { item, condition, location } = req.body;
  const prompt = `
You are a waste management expert in India. A user wants to dispose of an item with the following details:
- Item: ${item || 'Not specified'}
- Condition: ${condition || 'Not specified'}
- Location: ${location ? `${location.city || ''}, ${location.state || ''}, PIN: ${location.pincode || ''}` : 'Not specified'}

Please provide a comprehensive disposal guide in the following JSON format:
{
  "wasteType": "wet/dry/e-waste/hazardous",
  "disposalMethod": "...",
  "disposalLocation": "...",
  "recyclingInfo": "...",
  "sellingInfo": "...",
  "donts": ["..."]
}
Use Indian context and practices.
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: 'Upstream API error', detail: text });
    }

    const data = await response.json();
    // Expect the model to return JSON inside data.choices[0].message.content
    let parsed;
    try {
      parsed = JSON.parse(data.choices[0].message.content);
    } catch (e) {
      // If not JSON, send raw content
      return res.json({ raw: data.choices[0].message.content });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Proxy server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
