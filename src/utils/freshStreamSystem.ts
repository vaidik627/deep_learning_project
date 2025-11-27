/**
 * FRESH STREAMING SYSTEM - Simple & Reliable
 * No complex iteration, no TypeScript errors
 */

interface StreamState {
  text: string;
  isActive: boolean;
  callback: (text: string) => void;
}

export class FreshStreamManager {
  private streams: Record<string, StreamState> = {};

  /**
   * Start streaming for a model
   */
  start(modelId: string, callback: (text: string) => void): void {
    this.streams[modelId] = {
      text: '',
      isActive: true,
      callback
    };
  }

  /**
   * Add text to stream
   */
  addText(modelId: string, newText: string, isCumulative: boolean): void {
    const stream = this.streams[modelId];
    if (!stream || !stream.isActive) return;

    if (isCumulative) {
      // For APIs that send full text each time
      stream.text = newText;
    } else {
      // For character-by-character streaming
      stream.text += newText;
    }

    stream.callback(stream.text);
  }

  /**
   * Complete streaming
   */
  complete(modelId: string): string {
    const stream = this.streams[modelId];
    if (!stream) return '';

    stream.isActive = false;
    const finalText = stream.text;

    // Cleanup
    setTimeout(() => {
      delete this.streams[modelId];
    }, 100);

    return finalText;
  }

  /**
   * Stop streaming
   */
  stop(modelId: string): void {
    if (this.streams[modelId]) {
      this.streams[modelId].isActive = false;
      delete this.streams[modelId];
    }
  }

  /**
   * Clear all streams
   */
  clearAll(): void {
    this.streams = {};
  }

  /**
   * Check if streaming
   */
  isStreaming(modelId: string): boolean {
    return this.streams[modelId]?.isActive || false;
  }
}

/**
 * Ultra-fast character streaming helper with batching
 */
export async function streamChars(
  text: string,
  onChar: (char: string) => void,
  delayMs: number = 5
): Promise<void> {
  // Process in batches for faster streaming
  const BATCH_SIZE = 3; // Stream 3 characters at once

  for (let i = 0; i < text.length; i += BATCH_SIZE) {
    const batch = text.slice(i, i + BATCH_SIZE);
    for (const char of batch) {
      onChar(char);
    }
    // Only delay between batches, not between individual characters
    if (i + BATCH_SIZE < text.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}
