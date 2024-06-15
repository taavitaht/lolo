// Server js

const express = require('express');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// Middleware to handle CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


// General proxy endpoint
app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    try {
        const response = await axios.get(url);
        if (!response.data) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        res.status(200).send(response.data);
    } catch (error) {
        console.error('Error proxying request:', error);
        res.status(500).json({ error: 'Error proxying request' });
    }
});

// Proxy endpoint to forward POST requests
app.post('/webparser', async (req, res) => {
    const apiUrl = 'https://uptime-mercury-api.azurewebsites.net/webparser';
    const { url } = req.body;

    try {
        const response = await axios.post(apiUrl, { url }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error sending POST request:', error.message);
        res.status(500).json({ error: 'Error sending POST request to external API' });
    }
});

// Send index.html for any other request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
