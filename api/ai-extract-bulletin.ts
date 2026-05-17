import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fileData } = req.body;
  if (!fileData) return res.status(400).json({ error: 'Missing file data' });

  // Retrieve Groq API Key from environment variables
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured on Vercel' });
  }

  try {
    console.log('Starting Groq vision analysis...');

    // Extract base64 data and clean it (strip prefix)
    const base64Data = fileData.split(',')[1] || fileData;

    const prompt = `
      Extract the subjects, grades (scores out of 20), and coefficients from this school report card (bulletin scolaire). 
      Also extract the teacher's general comment or behavior observation if present.
      
      You MUST return a JSON object with this exact structure:
      {
        "grades": [
          { "subject": "Mathématiques", "score": 15.5, "coefficient": 2 }
        ],
        "behavior": "L'élève est sérieux et travailleur."
      }
      
      Rules:
      - If a score is not out of 20, convert/normalize it to 20.
      - Be extremely precise. 
      - Return ONLY the raw JSON object, nothing else.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.2-11b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Data}`
                }
              }
            ]
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error Response:', errText);
      throw new Error(`Groq API responded with ${response.status}: ${errText}`);
    }

    const result = await response.json();
    const textContent = result.choices?.[0]?.message?.content;
    console.log('Groq Raw response:', textContent);

    if (!textContent) {
      throw new Error('Groq did not return any content.');
    }

    // Parse JSON safely
    const data = JSON.parse(textContent.trim());
    console.log('Successfully parsed data:', data);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Groq extraction error details:', error);
    return res.status(500).json({ 
      error: 'Échec de l\'analyse par l\'IA (Groq)', 
      details: error.message 
    });
  }
}
