// filepath: c:\Users\visio\Documents\GitHub\animedatabase\server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5173;

app.use(cors()); // Enable CORS for all routes

app.get('/api/anime', async (req, res) => {
  const { q } = req.query; // Get the search query from the request
  const API_BASE_URL = 'https://api.myanimelist.net/v2';
  const API_KEY = 'your_client_id_here'; // Replace with your MyAnimeList client ID

  try {
    const response = await axios.get(`${API_BASE_URL}/anime`, {
      params: { q, limit: 10 },
      headers: {
        accept: 'application/json',
        'X-MAL-CLIENT-ID': API_KEY,
      },
    });

    res.json(response.data); // Forward the API response to the frontend
  } catch (error) {
    console.error('Error fetching Anime:', error);
    res.status(500).json({ error: 'Failed to fetch Anime' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});