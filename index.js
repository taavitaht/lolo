// server.js

const express = require('express');
//const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Proxy endpoint to fetch RSS feed
app.get('/fetch-rss', async (req, res) => {
    try {
        const response = await fetch('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        res.setHeader('Content-Type', 'application/xml');
        res.status(200).send(text);
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).send('Error fetching RSS feed');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
