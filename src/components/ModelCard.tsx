import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import { Trash2, User, Bot } from 'lucide-react';

interface ChatMessage {
  user: string;
  ai: string;
  timestamp: number;
}

interface ModelCardProps {
  id: string;
  name: string;
  color: string;
  isEnabled: boolean;
  onToggle: () => void;
  isTyping?: boolean;
  conversation?: ChatMessage[];
}

const ModelCard: React.FC<ModelCardProps> = ({ 
  id, 
  name, 
  color, 
  isEnabled, 
  onToggle,
  isTyping = false,
  conversation = []
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversation]);
  
  // Clear conversation for this model
  const clearConversation = () => {
    if (window.confirm(`Clear conversation history for ${name}?`)) {
      localStorage.removeItem(`chat_${id}`);
      window.location.reload();
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  
  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden w-full flex-shrink-0 group ${
        isEnabled ? '' : 'opacity-50'
      }`}
      style={{
        border: '1.5px solid transparent',
        backgroundImage: isEnabled 
          ? `linear-gradient(#0d0e10, #0d0e10), linear-gradient(135deg, ${color}, ${color}80, ${color}40)`
          : 'linear-gradient(#0d0e10, #0d0e10), linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        boxShadow: isEnabled 
          ? `0 0 20px ${color}30, inset 0 0 20px ${color}08` 
          : 'none',
        minHeight: 'fit-content',
        maxHeight: '80vh'
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        boxShadow: isTyping && isEnabled
          ? [
              `0 0 20px ${color}30, inset 0 0 20px ${color}08`,
              `0 0 35px ${color}50, inset 0 0 30px ${color}15`,
              `0 0 20px ${color}30, inset 0 0 20px ${color}08`
            ]
          : isEnabled
          ? `0 0 20px ${color}30, inset 0 0 20px ${color}08`
          : 'none'
      }}
      transition={{ 
        duration: 0.3,
        boxShadow: { duration: 1.2, repeat: isTyping ? Infinity : 0 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background with particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-black/90 z-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}20, transparent 60%)`
          }}
        />
        {/* Inner glow on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${color}10, transparent 70%)`
          }}
        />
        {isEnabled && <ParticleBackground intensity="low" />}
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <h3 className="font-medium" style={{ color }}>{name}</h3>
          </div>
          
          {/* Toggle Switch */}
          <button 
            onClick={onToggle}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              isEnabled ? 'bg-opacity-50' : 'bg-white/10'
            }`}
            style={{ backgroundColor: isEnabled ? color : '' }}
          >
            <motion.div 
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white"
              animate={{ x: isEnabled ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        
        {/* Content Area */}
        <div 
          ref={chatContainerRef}
          className="min-h-[120px] max-h-[350px] overflow-y-auto bg-black/30 backdrop-blur-sm rounded-lg p-3 text-sm text-white/90 border border-white/5 hide-scrollbar"
        >
          {conversation.length === 0 ? (
            <p className="text-white/60 italic text-xs">
              {isEnabled 
                ? "Waiting for your query..."
                : "Enable this model to see responses."}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Stacked Conversation History */}
              {conversation.map((msg, idx) => (
                <motion.div
                  key={`msg-${idx}`}
                  className="fade-in"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* User message */}
                  <div className="flex items-start gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={12} className="text-white/60" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/70 leading-relaxed">{msg.user}</p>
                      <span className="text-[10px] text-white/30">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                  
                  {/* AI response */}
                  <div className="flex items-start gap-2">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Bot size={12} style={{ color }} />
                    </div>
                    <div className="flex-1">
                      {/* Show message content with typing animation */}
                      {msg.ai === "Generating..." ? (
                        <div className="flex items-center gap-1">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: color }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          />
                          <span className="ml-1 text-xs" style={{ color }}>Generating...</span>
                        </div>
                      ) : (
                        <>
                          <p className={`text-xs text-white leading-relaxed whitespace-pre-line ${idx === conversation.length - 1 && msg.ai.length > 0 && msg.ai !== "Generating..." ? 'typing-effect' : ''}`}>{msg.ai}</p>
                          <span className="text-[10px] text-white/30">{formatTime(msg.timestamp)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Clear conversation button */}
              {conversation.length > 0 && (
                <motion.button
                  onClick={clearConversation}
                  className="flex items-center gap-1.5 text-[10px] text-red-400/70 hover:text-red-400 transition-colors mt-1.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={10} />
                  <span>Clear</span>
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Hover effect */}
      {isHovered && isEnabled && (
        <motion.div 
          className="absolute inset-0 border-2 rounded-xl z-20 pointer-events-none"
          style={{ borderColor: color }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              `0 0 20px ${color}40`,
              `0 0 40px ${color}60`,
              `0 0 20px ${color}40`
            ]
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export default ModelCard;


