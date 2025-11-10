import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isFirstPrompt: boolean;
  setIsFirstPrompt: (value: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isFirstPrompt, setIsFirstPrompt }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    onSubmit(message);
    setMessage('');
    
    if (isFirstPrompt) {
      setIsFirstPrompt(false);
    }
  };
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, [message]);
  
  // Input container variants with smooth transitions
  const containerVariants = {
    center: { 
      maxWidth: '700px',
      width: '90%',
      y: '-50%',
      x: '-50%',
      left: '50%',
      bottom: '50%',
      position: 'absolute' as 'absolute',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as any,
      }
    },
    bottom: { 
      maxWidth: '900px',
      width: '90%',
      y: 0,
      x: '-50%',
      left: '50%',
      bottom: '20px',
      position: 'fixed' as 'fixed',
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as any,
      }
    }
  };
  
  return (
    <motion.div
      className="z-30 transition-all duration-500 ease-in-out"
      initial={isFirstPrompt ? 'center' : 'bottom'}
      animate={isFirstPrompt ? 'center' : 'bottom'}
      variants={containerVariants}
    >
      <form 
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-br from-background/90 via-background/85 to-background/90 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl group"
        style={{
          border: '2px solid transparent',
          backgroundImage: 'linear-gradient(#0d0e10, #0d0e10), linear-gradient(90deg, #00ffc6, #ff6b00, #b366ff)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        {/* Inner glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/5 via-orange/5 to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything and press Enter..."
          className="w-full bg-transparent py-4 px-5 pr-16 outline-none resize-none max-h-[150px] text-white relative z-10 placeholder:text-white/40"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <motion.button
          type="submit"
          className="absolute right-3 bottom-3 p-2.5 rounded-lg bg-gradient-to-r from-neonCyan via-orange to-purple text-white disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          disabled={!message.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <Send size={20} className="relative z-10" />
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ChatInput;
