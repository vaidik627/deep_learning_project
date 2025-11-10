/**
 * NVIDIA API Integration Test
 * Tests the real moonshotai/kimi-k2-instruct model
 */

const API_KEY = "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";
const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2-instruct";

async function testNvidiaAPI() {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 NVIDIA API INTEGRATION TEST');
  console.log('='.repeat(70));
  console.log(`\n📍 Endpoint: ${ENDPOINT}`);
  console.log(`🤖 Model: ${MODEL}`);
  console.log(`🔑 API Key: ${API_KEY.substring(0, 20)}...`);
  
  const testPrompts = [
    "Hello! Introduce yourself in one sentence.",
    "What is 2 + 2?",
    "Tell me a fun fact."
  ];
  
  for (let i = 0; i < testPrompts.length; i++) {
    const prompt = testPrompts[i];
    console.log('\n' + '='.repeat(70));
    console.log(`🧪 TEST ${i + 1}: "${prompt}"`);
    console.log('='.repeat(70));
    
    const startTime = Date.now();
    
    try {
      console.log('\n📤 Sending request to NVIDIA...');
      
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          top_p: 0.9,
          max_tokens: 4096,
          stream: true
        }),
      });
      
      const duration = Date.now() - startTime;
      console.log(`\n📥 Response received in ${duration}ms`);
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('\n❌ API ERROR:');
        console.error(`   Status: ${response.status}`);
        console.error(`   Response: ${errorText}`);
        continue;
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let chunkCount = 0;
      
      console.log('\n📥 Streaming response...\n');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter(l => l.trim().startsWith("data:"));
        
        for (const line of lines) {
          const json = line.replace(/^data:\s*/, "");
          if (json === "[DONE]") {
            console.log('\n✅ Stream complete');
            break;
          }
          
          try {
            const data = JSON.parse(json);
            const content = data?.choices?.[0]?.delta?.content;
            if (content) {
              result += content;
              chunkCount++;
              process.stdout.write(content);
            }
          } catch (e) {
            console.warn("\n⚠️ Chunk parsing error:", e.message);
          }
        }
      }
      
      const totalDuration = Date.now() - startTime;
      
      console.log('\n\n' + '='.repeat(70));
      console.log('✅ SUCCESS!');
      console.log(`   Total Duration: ${totalDuration}ms`);
      console.log(`   Chunks Received: ${chunkCount}`);
      console.log(`   Response Length: ${result.length} characters`);
      console.log('='.repeat(70));
      
    } catch (error) {
      console.error('\n❌ EXCEPTION:', error.message);
    }
    
    if (i < testPrompts.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('🎉 TEST SUITE COMPLETED');
  console.log('='.repeat(70));
}

testNvidiaAPI();
