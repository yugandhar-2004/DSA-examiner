// backend/judge0-proxy.js

const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true';
const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY'; // 🔁 Replace with your real RapidAPI Key

router.post('/run', async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const response = await fetch(JUDGE0_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({ source_code, language_id, stdin })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Judge0:', error);
    res.status(500).json({ error: 'Execution failed. Try again.' });
  }
});

module.exports = router;
