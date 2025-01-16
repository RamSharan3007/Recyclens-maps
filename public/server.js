const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/recycling-centers', async (req, res) => {

  try {
    const response = await axios.get(`https://api.geoapify.com/v2/places?categories=service.recycling&filter=rect:79.44813424326298,13.601608593449258,80.76997020744653,12.376098784128969&limit=20&apiKey=85b935f9a74b4e2b8b190e61c5408510
`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recycling centers:", error);
    res.status(500).json({ error: 'Failed to fetch recycling centers' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
