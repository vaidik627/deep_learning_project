import React, { useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  onClearChat?: () => void;
  isTyping?: boolean;
  conversation?: ChatMessage[];
}

// Fresh streaming indicator with smooth animations
const StreamingDots = memo(({ color }: { color: string }) => (
  <div className="flex items-center gap-3 py-3">
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 200}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
    <span className="text-xs font-medium animate-pulse" style={{ color }}>
      Generating...
    </span>
  </div>
));

StreamingDots.displayName = 'StreamingDots';

// Fresh ModelCard with new design
const ModelCard: React.FC<ModelCardProps> = memo(({
  id,
  name,
  color,
  isEnabled,
  onToggle,
  onClearChat,
  isTyping = false,
  conversation = []
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(conversation.length);

  const clearChat = () => {
    if (window.confirm(`Clear ${name} conversation?`)) {
      if (onClearChat) {
        onClearChat();
      }
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Track if user is manually scrolling
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | undefined>(undefined);

  // Detect manual scrolling with better event handling
  const handleScroll = useCallback((e: React.UIEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    isUserScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 800); // Shorter timeout for better responsiveness
  }, []);

  // Smooth auto-scroll with debouncing
  useEffect(() => {
    if (!isUserScrollingRef.current && chatContainerRef.current) {
      // Debounce scroll updates for smoother performance
      const scrollToBottom = () => {
        if (chatContainerRef.current && !isUserScrollingRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      };

      // Use requestAnimationFrame for 60fps smooth scrolling
      const rafId = requestAnimationFrame(scrollToBottom);

      return () => cancelAnimationFrame(rafId);
    }
  }, [conversation]);

  return (
    <motion.div
      className="relative w-full flex-shrink-0 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(15, 15, 20, 0.7)',
        backdropFilter: 'blur(20px)',
        border: `2px solid ${isEnabled ? color : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isEnabled
          ? `0 0 30px ${color}40, 0 8px 32px rgba(0, 0, 0, 0.4)`
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        width: '400px',
        height: '520px',
        pointerEvents: 'auto'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isEnabled ? 1 : 0.6,
        y: 0,
        scale: isEnabled ? 1 : 0.98
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${color}15, transparent)`,
          borderBottom: `1px solid ${color}20`,
          pointerEvents: 'auto'
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${color}30, ${color}10)`,
              border: `1px solid ${color}40`
            }}
          >
            <Sparkles size={18} style={{ color }} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              {name}
              {isTyping && (
                <div className="flex gap-1">
                  <motion.span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.span
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              )}
            </h3>
            <p className="text-xs text-white/60">
              {isTyping ? 'Generating...' : 'Ready'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Clear conversation"
          >
            <Trash2 size={16} className="text-white/60" />
          </button>

          <button
            onClick={onToggle}
            className="px-4 py-2 rounded-lg font-medium text-sm transition-all"
            style={{
              background: isEnabled ? `${color}20` : 'rgba(255, 255, 255, 0.05)',
              color: isEnabled ? color : 'rgba(255, 255, 255, 0.5)',
              border: `1px solid ${isEnabled ? color + '40' : 'rgba(255, 255, 255, 0.1)'}`
            }}
          >
            {isEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="h-[420px] overflow-y-auto px-4 py-3 space-y-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: `${color}40 transparent`,
          WebkitOverflowScrolling: 'touch',
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          overscrollBehavior: 'contain'
        }}
      >
        {conversation.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {conversation.map((msg, idx) => {
              const isGenerating = msg.ai === "Generating...";
              const isLast = idx === conversation.length - 1;

              return (
                <div
                  key={`${idx}-${msg.timestamp}`}
                  className="space-y-3 animate-fadeIn"
                >
                  {/* User Message */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] text-white/95 leading-[1.6] whitespace-pre-wrap break-words font-normal">{msg.user}</p>
                      <span className="text-[11px] text-white/40 mt-0.5 block">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${color}20`,
                        border: `1px solid ${color}40`
                      }}
                    >
                      <Bot size={14} style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {msg.ai === "Generating..." ? (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <motion.div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: color }}
                              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                          <span className="text-sm text-white/60">Thinking...</span>
                        </div>
                      ) : (
                        <div
                          className="text-[15px] text-white/95 prose prose-invert max-w-none w-full streaming-text"
                          style={{
                            willChange: isTyping && isLast ? 'contents' : 'auto',
                            contain: 'layout style paint',
                            lineHeight: '1.7',
                            letterSpacing: '0.01em',
                            textShadow: isTyping && isLast ? `0 0 8px ${color}20` : 'none'
                          }}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-4 w-full">
                                  <table className="w-full border-collapse border border-white/20" {...props} />
                                </div>
                              ),
                              thead: ({ node, ...props }) => (
                                <thead className="bg-white/5" {...props} />
                              ),
                              th: ({ node, ...props }) => (
                                <th className="border border-white/20 px-3 py-2 text-left font-semibold" {...props} />
                              ),
                              td: ({ node, ...props }) => (
                                <td className="border border-white/20 px-3 py-2" {...props} />
                              ),
                              tr: ({ node, ...props }) => (
                                <tr className="hover:bg-white/5 transition-colors" {...props} />
                              ),
                              code: ({ node, className, children, ...props }: any) => {
                                const isInline = !className?.includes('language-');
                                const lightColor = color === '#a78bfa' ? '#c4b5fd' : color;
                                return isInline ? (
                                  <code
                                    className="px-1.5 py-0.5 rounded text-xs font-mono"
                                    style={{
                                      backgroundColor: `${lightColor}20`,
                                      color: lightColor,
                                      border: `1px solid ${lightColor}30`
                                    }}
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                ) : (
                                  <div className="overflow-x-auto my-3 rounded-lg" style={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                    border: `1px solid ${lightColor}20`,
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: `${lightColor}40 transparent`
                                  }}>
                                    <code
                                      className="block p-4 text-xs font-mono whitespace-pre"
                                      style={{
                                        minWidth: 'max-content'
                                      }}
                                      {...props}
                                    >
                                      {children}
                                    </code>
                                  </div>
                                );
                              },
                              blockquote: ({ node, ...props }) => {
                                const lightColor = color === '#a78bfa' ? '#c4b5fd' : color;
                                return (
                                  <blockquote
                                    className="border-l-4 pl-4 py-2 my-3 italic"
                                    style={{
                                      borderColor: lightColor,
                                      backgroundColor: `${lightColor}10`
                                    }}
                                    {...props}
                                  />
                                );
                              },
                              hr: ({ node, ...props }) => (
                                <hr className="my-4 border-white/20" {...props} />
                              ),
                              p: ({ node, ...props }) => (
                                <p className="mb-2.5 last:mb-0 w-full break-words" style={{ lineHeight: '1.7' }} {...props} />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul className="mb-2.5 space-y-1.5 w-full" style={{ paddingLeft: '1.5em' }} {...props} />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol className="mb-2.5 space-y-1.5 w-full" style={{ paddingLeft: '1.5em' }} {...props} />
                              ),
                              li: ({ node, children, ...props }) => (
                                <li className="break-words w-full" style={{ lineHeight: '1.7' }} {...props}>
                                  {children}
                                </li>
                              ),
                              h1: ({ node, ...props }) => (
                                <h1 className="text-[17px] font-bold mb-2 mt-3 text-white" style={{ lineHeight: '1.4' }} {...props} />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2 className="text-[16px] font-bold mb-2 mt-3 text-white" style={{ lineHeight: '1.4' }} {...props} />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3 className="text-[15px] font-semibold mb-1.5 mt-2.5 text-white/95" style={{ lineHeight: '1.4' }} {...props} />
                              ),
                              h4: ({ node, ...props }) => (
                                <h4 className="text-[14px] font-semibold mb-1.5 mt-2 text-white/90" style={{ lineHeight: '1.4' }} {...props} />
                              ),
                              strong: ({ node, ...props }) => {
                                const lightColor = color === '#a78bfa' ? '#c4b5fd' : color;
                                return (
                                  <strong
                                    className="font-bold px-0.5 rounded"
                                    style={{
                                      color: lightColor,
                                      textShadow: `0 0 10px ${lightColor}40`
                                    }}
                                    {...props}
                                  />
                                );
                              },
                              em: ({ node, ...props }) => (
                                <em className="italic text-white/90" {...props} />
                              ),
                              a: ({ node, ...props }) => {
                                const lightColor = color === '#a78bfa' ? '#c4b5fd' : color;
                                return (
                                  <a
                                    className="underline decoration-2 hover:decoration-4 transition-all cursor-pointer font-medium"
                                    style={{
                                      color: lightColor,
                                      textDecorationColor: `${lightColor}60`
                                    }}
                                    {...props}
                                  />
                                );
                              },
                            }}
                          >
                            {msg.ai}
                          </ReactMarkdown>
                          {isTyping && isLast && (
                            <span
                              className="inline-block w-0.5 h-4 ml-1 typing-cursor"
                              style={{ backgroundColor: color }}
                            />
                          )}
                        </div>
                      )}
                      {msg.ai !== "Generating..." && (
                        <span className="text-[11px] text-white/40 mt-0.5 block">{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: `${color}15`,
                border: `1px solid ${color}30`
              }}
            >
              <Sparkles size={28} style={{ color }} className="opacity-60" />
            </div>
            <p className="text-sm text-white/60 mb-1">No messages yet</p>
            <p className="text-xs text-white/40">Start chatting with {name}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Optimized comparison
  if (prevProps.isEnabled !== nextProps.isEnabled) return false;
  if (prevProps.isTyping !== nextProps.isTyping) return false;

  const prevConv = prevProps.conversation || [];
  const nextConv = nextProps.conversation || [];

  if (prevConv.length !== nextConv.length) return false;

  if (prevConv.length > 0 && nextConv.length > 0) {
    const prevLast = prevConv[prevConv.length - 1];
    const nextLast = nextConv[nextConv.length - 1];
    if (prevLast.ai !== nextLast.ai) return false;
  }

  return true;
});

ModelCard.displayName = 'ModelCard';

export default ModelCard;
