import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  sidebarExpanded?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, sidebarExpanded = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSubmit(message);
    setMessage('');
  };
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, [message]);

  return (
    <form 
      onSubmit={handleSubmit}
      className="chat-input relative overflow-hidden shadow-2xl w-full"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask anything and press Enter..."
        className="w-full bg-transparent py-4 px-5 pr-16 outline-none resize-none max-h-[150px] text-white placeholder:text-white/40 text-base leading-relaxed"
        rows={1}
        style={{ fontSize: '15px', lineHeight: '1.75' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <button
          type="submit"
          className="send-button-gradient p-2.5 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
