/*
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS middleware to allow requests from any origin
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with specific origin if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Example proxy endpoint to fetch and forward data
app.get('/fetch-rss', async (req, res) => {
    try {
        const response = await fetch('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        res.header('Content-Type', 'application/xml');
        res.send(text);
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).send('Error fetching RSS feed');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server listening on port ${PORT}`);
});
*/


module.exports = async (req, res) => {
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
};