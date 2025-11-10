// src/utils/api.ts
// NVIDIA API Handler via CORS Proxy Server

const PROXY_ENDPOINT = 'http://localhost:3001/api/nvidia/chat';

export async function fetchModelResponse(model: string, prompt: string, onStream?: (text: string) => void) {
  if (model !== "NVIDIA Kimi Instruct" && model !== "GPT-5 Nano" && model !== "gpt") return "";

  try {
    const response = await fetch(PROXY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2-instruct",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        top_p: 0.9,
        max_tokens: 4096,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Proxy request failed: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    console.log('📥 Streaming response from NVIDIA via proxy...');

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
          const delta = data?.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            if (onStream) onStream(fullText);
          }
        } catch (e) {
          console.warn("Chunk parsing error:", e);
        }
      }
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
