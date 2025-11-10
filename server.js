/**
 * CORS Proxy Server for NVIDIA API
 * This server acts as a middleman to bypass browser CORS restrictions
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// NVIDIA API Configuration
const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = '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';

// Proxy endpoint for NVIDIA API
app.post('/api/nvidia/chat', async (req, res) => {
  console.log('📥 Received request from frontend:', req.body);
  
  try {
    const response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('📤 NVIDIA API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NVIDIA API error:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // Check if streaming is requested
    if (req.body.stream) {
      // Set headers for streaming
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Pipe the streaming response
      response.body.pipe(res);
    } else {
      // Non-streaming response
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NVIDIA proxy server is running' });
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log('🚀 NVIDIA API Proxy Server Started');
  console.log(`${'='.repeat(60)}`);
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 Proxy endpoint: http://localhost:${PORT}/api/nvidia/chat`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`${'='.repeat(60)}\n`);
});
