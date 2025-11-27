// src/utils/api.ts
// API Handler via CORS Proxy Server (NVIDIA + OpenRouter)

const NVIDIA_PROXY_ENDPOINT = 'http://localhost:3001/api/nvidia/chat';
const OPENROUTER_PROXY_ENDPOINT = 'http://localhost:3001/api/openrouter/chat';

// Model configuration mapping with optimized token limits
const MODEL_CONFIG: Record<string, { modelName: string; temperature: number; topP: number; maxTokens: number }> = {
  gpt: {
    modelName: 'moonshotai/kimi-k2-instruct',
    temperature: 0.6,
    topP: 0.9,
    maxTokens: 8192 // Kimi supports up to 8K tokens
  },
  gemini: {
    modelName: 'openai/gpt-oss-20b',
    temperature: 1,
    topP: 1,
    maxTokens: 4096 // GPT-OSS-20B standard limit
  },
  deepseek: {
    modelName: 'microsoft/phi-4-mini-instruct',
    temperature: 0.1,
    topP: 0.7,
    maxTokens: 2048 // Phi-4 Mini optimized limit
  },
  perplexity: {
    modelName: 'nvidia/nvidia-nemotron-nano-9b-v2',
    temperature: 0.6,
    topP: 0.95,
    maxTokens: 4096 // Nemotron Nano standard limit
  },
  anthropic: {
    modelName: 'x-ai/grok-4.1-fast',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 8192 // Grok 4.1 supports up to 8K tokens
  }
};

export async function fetchModelResponse(model: string, prompt: string, onStream?: (text: string) => void) {
  if (model !== "gpt" && model !== "gemini" && model !== "deepseek" && model !== "perplexity" && model !== "anthropic") return "";

  const config = MODEL_CONFIG[model];
  if (!config) return "";

  try {
    console.log(`🚀 Fetching response for ${model} (${config.modelName})`);

    // Determine which proxy endpoint to use
    const proxyEndpoint = model === 'anthropic' ? OPENROUTER_PROXY_ENDPOINT : NVIDIA_PROXY_ENDPOINT;

    // Add system message for models to format responses like Kimi
    const messages = (model === 'gemini' || model === 'deepseek')
      ? [
        {
          role: "system",
          content: "You are a helpful AI assistant. Always respond in clear paragraphs and bullet points. Never use tables or complex markdown formatting. Keep responses concise and easy to read."
        },
        { role: "user", content: prompt }
      ]
      : [{ role: "user", content: prompt }];

    const response = await fetch(proxyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.modelName,
        messages: messages,
        temperature: config.temperature,
        top_p: config.topP,
        max_tokens: config.maxTokens,
        stream: true,
      }),
    });

    console.log(`📡 Response status for ${model}:`, response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ${model} API Error:`, errorText);
      throw new Error(`Proxy request failed for ${model}: ${response.status} - ${errorText}`);
    }

    if (!response.body) {
      console.error(`❌ ${model}: No response body`);
      throw new Error(`No response body from ${model}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    console.log(`📥 Streaming response from NVIDIA via proxy for ${model}...`);

    // ULTRA-FAST streaming for instant ChatGPT-like performance
    const streamCharacters = async (text: string) => {
      // Process larger chunks for blazing fast streaming
      const BATCH_SIZE = 12; // Process 12 characters at once for ultra-fast feel

      for (let i = 0; i < text.length; i += BATCH_SIZE) {
        const chunk = text.slice(i, i + BATCH_SIZE);
        fullText += chunk;

        if (onStream) {
          // Direct update with requestAnimationFrame for 120fps+ rendering
          await new Promise(resolve => {
            requestAnimationFrame(() => {
              onStream(fullText);
              // Minimal delay for smooth but fast animation (0-2ms)
              setTimeout(resolve, Math.random() * 2);
            });
          });
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(line => line.trim().startsWith("data:"));

      for (const line of lines) {
        const jsonLine = line.replace(/^data:\s*/, "");
        if (jsonLine === "[DONE]") continue;

        try {
          const data = JSON.parse(jsonLine);
          const delta = data?.choices?.[0]?.delta;

          // Log for debugging (especially for Phi-4)
          if (model === 'deepseek' && delta) {
            console.log(`🧠 Phi-4 delta:`, JSON.stringify(delta));
          }

          // Skip reasoning content (internal thinking) - only show final answer
          // const reasoning = delta?.reasoning_content;
          // if (reasoning) {
          //   await streamCharacters(reasoning);
          // }

          // Handle regular content (final answer)
          const content = delta?.content;
          if (content) {
            // Stream regular content immediately
            await streamCharacters(content);
          }
        } catch (e) {
          console.warn(`⚠️ ${model} chunk parsing error:`, e);
        }
      }
    }

    // Send final update
    if (onStream && fullText) {
      onStream(fullText);
    }

    if (!fullText.trim()) return "⚠️ No response from model.";

    console.log('✅ NVIDIA response complete:', fullText.length, 'characters');

    return fullText.trim();

  } catch (err) {
    console.error("⚠️ API Error:", err);
    return "⚠️ Failed to connect to NVIDIA proxy. Ensure server is running on port 3001.";
  }
}

export async function initializeNvidiaAPI(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3001/api/health');
    const data = await res.json();

    if (res.ok && data.status === 'ok') {
      console.log("✅ NVIDIA proxy server connected.");
      return true;
    }
    return false;
  } catch (e) {
    console.error("⚠️ Proxy server not reachable. Start with: node server.js");
    return false;
  }
}
