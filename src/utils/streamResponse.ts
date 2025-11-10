/**
 * Universal Streaming Response Handler
 * Simulates character-by-character streaming for any text response
 */

export async function simulateStreamingResponse(
  model: string,
  fullText: string,
  updateCallback: (partialText: string) => void,
  speed: number = 15 // 15ms per character for smooth streaming
): Promise<string> {
  let streamed = "";
  
  // Stream character by character
  for (const char of fullText) {
    streamed += char;
    updateCallback(streamed);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  
  return streamed;
}

/**
 * Dynamic speed based on text length
 * Shorter responses type faster, longer ones slower
 */
export function calculateStreamingSpeed(textLength: number): number {
  // Min 10ms, Max 50ms per character
  return Math.max(10, Math.min(50, Math.floor(2000 / textLength)));
}

/**
 * Stream response word by word (alternative approach)
 */
export async function simulateWordByWordStreaming(
  fullText: string,
  updateCallback: (partialText: string) => void,
  speed: number = 40 // 40ms per word
): Promise<string> {
  const words = fullText.split(' ');
  let streamed = "";
  
  for (let i = 0; i < words.length; i++) {
    streamed += (i > 0 ? ' ' : '') + words[i];
    updateCallback(streamed);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
  
  return streamed;
}
