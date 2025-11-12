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

// API Keys for different models
const API_KEYS = {
  'moonshotai/kimi-k2-instruct': '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',
  'openai/gpt-oss-20b': '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',
  'microsoft/phi-4-mini-instruct': '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'
};

// Proxy endpoint for NVIDIA API
app.post('/api/nvidia/chat', async (req, res) => {
  console.log('📥 Received request from frontend:', req.body);
  
  try {
    // Get the appropriate API key based on model
    const modelName = req.body.model;
    const apiKey = API_KEYS[modelName];
    
    if (!apiKey) {
      console.error('❌ No API key found for model:', modelName);
      return res.status(400).json({ error: `Unsupported model: ${modelName}` });
    }
    
    console.log('🔑 Using API key for model:', modelName);
    
    const response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
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

// Test endpoint to verify API keys
app.post('/api/test', async (req, res) => {
  const { model } = req.body;
  
  console.log('🧪 Testing API connection for model:', model);
  
  const apiKey = API_KEYS[model];
  if (!apiKey) {
    return res.status(400).json({ 
      success: false, 
      error: `No API key for model: ${model}` 
    });
  }
  
  try {
    const response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 10,
        stream: false
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ API test successful for:', model);
      res.json({ 
        success: true, 
        model: model,
        response: data.choices?.[0]?.message?.content || 'OK'
      });
    } else {
      console.error('❌ API test failed:', data);
      res.status(response.status).json({ 
        success: false, 
        error: data 
      });
    }
  } catch (error) {
    console.error('❌ Test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
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
