require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'https://quizengine.netlify.app'
}));
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html directly

const ai = new GoogleGenAI({});
const modelName = 'gemini-2.5-flash';

// Quiz API
app.post('/generate-quiz', async (req, res) => {
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: 'Content is required' });

  const prompt = `
${content} 
Generate 5 quiz questions on given Topic and content, Your response must follow this structure because this model is directly integrated into a real time application. Follow the structure, generate 5 questions without any other word 

(No extra symbols)
Structure: 
\`\`'<Question 1>'\`\`
--<option1>--
--<option2>--
--<option3>--
--<option4>--
--<correct option among 4 options>--
`;

  try {
    const result = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    res.json({ response: result.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
