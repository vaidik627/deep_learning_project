import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, History, Settings, Zap, Plus, Trash2, MessageSquare } from 'lucide-react';
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
  onDeleteSession?: (sessionId: string) => void;
  onClearHistory?: () => void;
  onNewChat?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  toggleSidebar,
  chatSessions = [],
  currentSessionId = null,
  onLoadSession = () => { },
  onDeleteSession = () => { },
  onClearHistory = () => { },
  onNewChat = () => { }
}) => {
  const [activeSection, setActiveSection] = useState<'history' | 'superai' | 'settings'>('history');
  const [showSuperAIModal, setShowSuperAIModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Enhanced animation variants with smooth transitions
  const sidebarVariants = {
    expanded: {
      width: '280px',
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    },
    collapsed: {
      width: '70px',
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30,
        duration: 0.3
      }
    }
  };

  const contentVariants = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.2 }
    },
    hidden: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.15 }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group sessions by date
  const groupedSessions = chatSessions.reduce((groups: Record<string, ChatSession[]>, session) => {
    const dateKey = formatDate(session.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {});

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 h-full sidebar backdrop-blur-xl border-r border-white/10 z-20 shadow-2xl"
        initial={isExpanded ? 'expanded' : 'collapsed'}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        variants={sidebarVariants}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
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
              {isExpanded ? <ChevronLeft size={16} className="text-neonCyan" /> : <ChevronRight size={16} className="text-neonCyan" />}
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
          <div className="px-3 mb-4 relative z-10">
            <motion.button
              onClick={onNewChat}
              className="w-full bg-gradient-to-r from-neonCyan/20 to-purple/20 hover:from-neonCyan/30 hover:to-purple/30 border border-neonCyan/30 rounded-xl p-3 flex items-center justify-center gap-2 transition-all duration-300"
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 198, 0.2)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={18} className="text-neonCyan" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-sm font-medium text-white"
                  >
                    New Chat
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-3 mb-4 relative z-10">
            <div className="flex gap-1 bg-white/5 rounded-lg p-1">
              <motion.button
                onClick={() => setActiveSection('history')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeSection === 'history' ? 'bg-neonCyan/20 text-neonCyan' : 'text-white/60 hover:text-white/80'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <History size={16} />
                {isExpanded && <span className="text-xs font-medium">History</span>}
              </motion.button>

              <motion.button
                onClick={() => setActiveSection('settings')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeSection === 'settings' ? 'bg-neonCyan/20 text-neonCyan' : 'text-white/60 hover:text-white/80'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={16} />
                {isExpanded && <span className="text-xs font-medium">Settings</span>}
              </motion.button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto hide-scrollbar px-3 relative z-10">
            <AnimatePresence mode="wait">
              {activeSection === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {isExpanded ? (
                    <>
                      {Object.keys(groupedSessions).length > 0 ? (
                        Object.entries(groupedSessions).map(([dateKey, sessions]) => (
                          <div key={dateKey} className="space-y-2">
                            <p className="text-xs text-white/40 font-medium px-2">{dateKey}</p>
                            {sessions.map((session) => (
                              <motion.div
                                key={session.id}
                                className="relative group"
                                whileHover={{ scale: 1.02, x: 4 }}
                              >
                                <button
                                  onClick={() => onLoadSession(session.id)}
                                  className={`w-full text-left p-3 rounded-lg transition-all ${currentSessionId === session.id
                                      ? 'bg-neonCyan/10 border border-neonCyan/30'
                                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <MessageSquare size={14} className="text-neonCyan mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-white/90 truncate">{session.title}</p>
                                      <p className="text-xs text-white/40 mt-1">
                                        {session.modelsUsed.length} model{session.modelsUsed.length > 1 ? 's' : ''}
                                      </p>
                                    </div>
                                  </div>
                                </button>
                                {/* Delete button - appears on hover */}
                                <motion.button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Delete "${session.title}"?`)) {
                                      onDeleteSession(session.id);
                                    }
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-red-500/20 border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 size={12} className="text-red-400" />
                                </motion.button>
                              </motion.div>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <MessageSquare size={32} className="text-white/20 mx-auto mb-2" />
                          <p className="text-sm text-white/40">No chat history yet</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      {chatSessions.slice(0, 5).map((session) => (
                        <motion.button
                          key={session.id}
                          onClick={() => onLoadSession(session.id)}
                          className={`w-full p-2 rounded-lg transition-all ${currentSessionId === session.id
                            ? 'bg-neonCyan/20'
                            : 'bg-white/5 hover:bg-white/10'
                            }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageSquare size={18} className="text-neonCyan mx-auto" />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeSection === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {isExpanded ? (
                    <>
                      {/* Theme Setting */}
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/90 font-medium">Dark Mode</span>
                          <div className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={true}
                              readOnly
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-neonCyan/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neonCyan after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </div>
                        </div>
                        <p className="text-xs text-white/40">Always enabled for optimal viewing</p>
                      </div>

                      {/* Auto Scroll Setting */}
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-white/90 font-medium">Auto Scroll</span>
                          <div className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={true}
                              readOnly
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-neonCyan/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neonCyan after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                          </div>
                        </div>
                        <p className="text-xs text-white/40">Scroll to latest message</p>
                      </div>

                      {/* Streaming Speed */}
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <label className="text-sm text-white/90 font-medium block mb-2">Streaming Speed</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-sm text-white focus:border-neonCyan/50 focus:outline-none">
                          <option value="slow" className="bg-background">Slow (Readable)</option>
                          <option value="normal" className="bg-background">Normal</option>
                          <option value="fast" className="bg-background" selected>Fast (Current)</option>
                        </select>
                        <p className="text-xs text-white/40 mt-2">Ultra-fast streaming enabled</p>
                      </div>

                      {/* Export History */}
                      <motion.button
                        onClick={() => {
                          const dataStr = JSON.stringify(chatSessions, null, 2);
                          const dataBlob = new Blob([dataStr], { type: 'application/json' });
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `ai-chat-history-${Date.now()}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span className="text-sm text-blue-400 font-medium">Export History</span>
                      </motion.button>

                      {/* Import History */}
                      <motion.label
                        className="w-full p-3 rounded-lg bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all flex items-center gap-2 cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-sm text-green-400 font-medium">Import History</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const imported = JSON.parse(event.target?.result as string);
                                  if (Array.isArray(imported)) {
                                    localStorage.setItem('chatSessions', JSON.stringify(imported));
                                    window.location.reload();
                                  }
                                } catch (error) {
                                  alert('Invalid JSON file');
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                        />
                      </motion.label>

                      {/* Clear All History */}
                      <motion.button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
                            onClearHistory();
                          }
                        }}
                        className="w-full p-3 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 size={16} className="text-red-400" />
                        <span className="text-sm text-red-400 font-medium">Clear All History</span>
                      </motion.button>

                      {/* App Info */}
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 mt-4">
                        <p className="text-xs text-white/60 text-center">Multi-AI Platform v2.0</p>
                        <p className="text-xs text-white/40 text-center mt-1">Ultra-Fast Streaming Enabled</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Collapsed view - icons only */}
                      <motion.button
                        onClick={() => {
                          const dataStr = JSON.stringify(chatSessions, null, 2);
                          const dataBlob = new Blob([dataStr], { type: 'application/json' });
                          const url = URL.createObjectURL(dataBlob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `ai-chat-history-${Date.now()}.json`;
                          link.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="w-full p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Export History"
                      >
                        <svg className="w-5 h-5 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          if (window.confirm('Clear all history?')) {
                            onClearHistory();
                          }
                        }}
                        className="w-full p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        title="Clear History"
                      >
                        <Trash2 size={18} className="text-red-400 mx-auto" />
                      </motion.button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Super AI Button */}
          <div className="p-3 border-t border-white/10 relative z-10">
            <motion.button
              onClick={() => setShowSuperAIModal(true)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl p-3 flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
              <Zap size={18} className="text-white relative z-10" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-sm font-bold text-white relative z-10"
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
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="absolute left-full ml-2 bottom-3 bg-purple-600 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg"
                >
                  Super AI
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-purple-600" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Super AI Modal */}
      <AnimatePresence>
        {showSuperAIModal && (
          <SuperAIModal isOpen={showSuperAIModal} onClose={() => setShowSuperAIModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
