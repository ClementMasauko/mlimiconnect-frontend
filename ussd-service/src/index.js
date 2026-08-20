// src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createUSSDHandler } = require('./handlers');
const redis = require('./redis');
const handleUSSD = createUSSDHandler({ store: redis });

const app = express();
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({ limit: '10kb' }));
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// Single POST endpoint for Africa's Talking USSD callback
app.post('/ussd', async (req, res) => {
  try {
    const response = await handleUSSD(req.body);
    res.type('text/plain').send(response);
  } catch (error) {
    console.error('USSD Error:', error);
    res.status(200).type('text/plain').send('END Service error. Please try again later.');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 USSD server running on port ${PORT}`);
  console.log(`Callback URL for Africa's Talking: http://localhost:${PORT}/ussd`);
  console.log('Use ngrok to expose for testing: ngrok http 3000');
});
