import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, History, Settings, Zap, Plus, Trash2, MessageSquare } from 'lucide-react';
import SuperAIModal from './SuperAIModal';

interface ChatMessage {
  user: string;
  ai: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  modelsUsed: string[];
  messages: Record<string, ChatMessage[]>;
}

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  chatSessions?: ChatSession[];
  currentSessionId?: string | null;
  onLoadSession?: (sessionId: string) => void;
  onClearHistory?: () => void;
  onNewChat?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isExpanded, 
  toggleSidebar,
  chatSessions = [],
  currentSessionId = null,
  onLoadSession = () => {},
  onClearHistory = () => {},
  onNewChat = () => {}
}) => {
  const [activeSection, setActiveSection] = useState<'history' | 'superai' | 'settings'>('history');
  const [showSuperAIModal, setShowSuperAIModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showActivationShimmer, setShowActivationShimmer] = useState(false);
  
  // Enhanced animation variants - faster and smoother
  const sidebarVariants = {
    expanded: { 
      width: '260px',
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1] as any
      } 
    },
    collapsed: { 
      width: '70px',
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.25,
        ease: [0.4, 0, 0.2, 1] as any
      } 
    }
  };

  const textVariants = {
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.1, duration: 0.2 }
    },
    hidden: { 
      opacity: 0, 
      x: -10,
      transition: { duration: 0.15 }
    }
  };
  
  return (
    <motion.div 
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-r border-white/10 z-20 shadow-2xl transition-[width] duration-300 ease-in-out"
      initial={isExpanded ? 'expanded' : 'collapsed'}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neonCyan/5 via-transparent to-purple/5 pointer-events-none" />
        
        {/* Toggle Button */}
        <motion.button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-gradient-to-br from-background to-background/80 border border-white/20 rounded-full p-1.5 hover:border-neonCyan/60 transition-all duration-300 shadow-lg z-30"
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(0, 255, 198, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft size={16} className="text-neonCyan" />
          </motion.div>
        </motion.button>
        
        {/* Logo */}
        <div className="p-4 flex items-center justify-center relative z-10">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.span 
                key="full-logo"
                className="gradient-text font-bold text-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                AI Platform
              </motion.span>
            ) : (
              <motion.span 
                key="short-logo"
                className="gradient-text font-bold text-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        {/* New Chat Button */}
        {isExpanded && (
          <div className="p-4 relative z-10">
            <motion.button
              onClick={onNewChat}
              className="w-full flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-neonCyan/20 to-purple/20 border border-neonCyan/30 hover:border-neonCyan/60 transition-all duration-300"
              whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(0, 255, 198, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} className="text-neonCyan" />
              <span className="text-sm font-medium">New Chat</span>
            </motion.button>
          </div>
        )}
        
        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2 relative z-10 overflow-y-auto hide-scrollbar">
          <nav className="flex flex-col gap-2 px-3">
            {/* History Section */}
            {isExpanded && activeSection === 'history' && (
              <div className="space-y-2 max-h-[400px] overflow-y-auto hide-scrollbar">
                <div className="flex items-center gap-2 px-3 py-2">
                  <History size={16} className="text-neonCyan" />
                  <span className="text-xs font-semibold text-white/70">Chat History</span>
                </div>
                
                {chatSessions.length === 0 ? (
                  <div className="px-3 py-4 text-center">
                    <MessageSquare size={32} className="mx-auto mb-2 text-white/30" />
                    <p className="text-xs text-white/50">No chat history yet</p>
                    <p className="text-xs text-white/30 mt-1">Start a conversation!</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Group by time */}
                    {(() => {
                      const now = Date.now();
                      const today = chatSessions.filter(s => now - s.timestamp < 86400000);
                      const yesterday = chatSessions.filter(s => now - s.timestamp >= 86400000 && now - s.timestamp < 172800000);
                      const older = chatSessions.filter(s => now - s.timestamp >= 172800000);
                      
                      return (
                        <>
                          {today.length > 0 && (
                            <div>
                              <p className="text-xs text-white/40 px-3 py-1">Today</p>
                              {today.map(session => (
                                <motion.button
                                  key={session.id}
                                  onClick={() => onLoadSession(session.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                    currentSessionId === session.id
                                      ? 'bg-neonCyan/20 border border-neonCyan/30'
                                      : 'hover:bg-white/5'
                                  }`}
                                  whileHover={{ x: 2 }}
                                >
                                  <p className="truncate text-white/80">{session.title}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    {session.modelsUsed.slice(0, 3).map((modelId, i) => (
                                      <span key={i} className="text-xs text-white/40">•</span>
                                    ))}
                                    <span className="text-xs text-white/40">
                                      {session.modelsUsed.length} model{session.modelsUsed.length > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          )}
                          
                          {yesterday.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-white/40 px-3 py-1">Yesterday</p>
                              {yesterday.map(session => (
                                <motion.button
                                  key={session.id}
                                  onClick={() => onLoadSession(session.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                    currentSessionId === session.id
                                      ? 'bg-neonCyan/20 border border-neonCyan/30'
                                      : 'hover:bg-white/5'
                                  }`}
                                  whileHover={{ x: 2 }}
                                >
                                  <p className="truncate text-white/80">{session.title}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                          
                          {older.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-white/40 px-3 py-1">Older</p>
                              {older.map(session => (
                                <motion.button
                                  key={session.id}
                                  onClick={() => onLoadSession(session.id)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                    currentSessionId === session.id
                                      ? 'bg-neonCyan/20 border border-neonCyan/30'
                                      : 'hover:bg-white/5'
                                  }`}
                                  whileHover={{ x: 2 }}
                                >
                                  <p className="truncate text-white/80">{session.title}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
            
            {/* Super AI */}
            <div className="relative">
              <motion.button 
                onClick={() => {
                  setShowSuperAIModal(true);
                  setShowActivationShimmer(true);
                  setTimeout(() => setShowActivationShimmer(false), 1500);
                }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="flex items-center gap-3 p-3 rounded-lg transition-all relative overflow-hidden w-full hover:bg-white/5"
                whileHover={{ 
                  scale: 1.02, 
                  x: 2
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <Zap 
                    size={isExpanded ? 20 : 24} 
                    className="relative z-10 text-neonCyan" 
                  />
                </div>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      className="relative z-10"
                      variants={textVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      Super AI
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              
              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && !isExpanded && (
                  <motion.div
                    className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-orange/90 backdrop-blur-md rounded-lg text-sm whitespace-nowrap z-50 border border-orange/30"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Launch Super AI Mode
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-orange/90" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>
        
        {/* Settings */}
        <div className="p-4 relative z-10">
          <motion.button 
            onClick={() => setActiveSection('settings')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full relative overflow-hidden ${
              activeSection === 'settings' 
                ? 'bg-white/10' 
                : 'hover:bg-white/5'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeSection === 'settings' && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple/20 to-transparent"
                layoutId="activeSection"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <Settings 
              size={isExpanded ? 20 : 24} 
              className="relative z-10 text-white/90" 
            />
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  className="relative z-10"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  Settings
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          {/* Clear History Button */}
          {isExpanded && chatSessions.length > 0 && (
            <motion.button
              onClick={onClearHistory}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all w-full mt-2"
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 size={18} className="text-red-400" />
              <span className="text-sm text-red-400">Clear History</span>
            </motion.button>
          )}
        </div>
      </div>
      
      {/* Activation Shimmer Effect */}
      <AnimatePresence>
        {showActivationShimmer && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Wave effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 10% 50%, rgba(255, 107, 0, 0.3), transparent 50%)',
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            
            {/* Shimmer sweep */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.4), transparent)',
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Super AI Modal */}
      <SuperAIModal isOpen={showSuperAIModal} onClose={() => setShowSuperAIModal(false)} />
    </motion.div>
  );
};

export default Sidebar;
