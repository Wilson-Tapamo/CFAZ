import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fileData } = req.body;
  if (!fileData) return res.status(400).json({ error: 'Missing file data' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract base64 data (strip prefix if present)
    const base64Data = fileData.split(',')[1] || fileData;

    const prompt = `
      Extract the subjects, grades (scores out of 20), and coefficients from this school report card (bulletin scolaire). 
      Also extract the teacher's general comment or behavior observation if present.
      
      Return ONLY a JSON object with this structure:
      {
        "grades": [
          { "subject": "Mathématiques", "score": 15.5, "coefficient": 2 },
          ...
        ],
        "behavior": "L'élève est sérieux et travailleur."
      }
      
      If a score is not out of 20, convert it to /20. 
      Be precise and only return valid JSON.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      }
    ]);

    const text = result.response.text();
    // Clean potential markdown code blocks
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('AI Extraction error:', error);
    return res.status(500).json({ error: 'Failed to extract data', details: error.message });
  }
}
