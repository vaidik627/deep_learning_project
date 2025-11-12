import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './App.css';
import ParticleBackground from './components/ParticleBackground';
import AnimatedGradientBackground from './components/AnimatedGradientBackground';
import DotBackground from './components/DotBackground';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import ModelCardContainer from './components/ModelCardContainer';
import { fetchModelResponse, initializeNvidiaAPI } from './utils/api';
import { FreshStreamManager, streamChars } from './utils/freshStreamSystem';
import { throttle } from './utils/throttle';

// Types
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

// Define model data with fresh vibrant colors
const modelData = [
  { id: 'gpt', name: 'NVIDIA Kimi Instruct', color: '#00ffaa', icon: '🤖' },
  { id: 'gemini', name: 'GPT-OSS-20B', color: '#a78bfa', icon: '🔮' },
  { id: 'deepseek', name: 'Microsoft Phi-4 Mini', color: '#f59e0b', icon: '🧠' },
  { id: 'perplexity', name: 'Perplexity Search', color: '#06b6d4', icon: '🔍' },
  { id: 'anthropic', name: 'Claude 3.5 Sonnet', color: '#ec4899', icon: '📝' },
  { id: 'mistral', name: 'Mistral Large', color: '#ef4444', icon: '🌪️' },
];

// Mock responses for different models
const mockResponses: Record<string, string[]> = {
  gpt: [
    "I'm NVIDIA Kimi Instruct, an advanced language model. I can help you with a wide range of tasks including writing, analysis, coding, and creative problem-solving. How can I assist you today?",
    "Based on your query, I'd recommend breaking this down into smaller, manageable steps. Let me provide a structured approach to help you achieve your goal effectively.",
    "That's an interesting question! Let me analyze this from multiple perspectives to give you a comprehensive answer."
  ],
  gemini: [
    "Hello! I'm GPT-OSS-20B, an open-source language model. I can help you with coding, analysis, and problem-solving tasks. How can I assist you today?",
    "I've processed your request and here's my analysis: This requires a balanced approach considering both technical feasibility and practical implementation.",
    "Great question! Let me break this down with clear examples and actionable insights."
  ],
  deepseek: [
    "DeepSeek Chat here! I specialize in deep reasoning and technical problem-solving. I can help you understand complex concepts and provide detailed technical explanations.",
    "Let me think about this systematically. Your question involves several interconnected factors that we should consider separately.",
    "Based on my analysis, here's a comprehensive explanation with the key technical details you need to know."
  ],
  perplexity: [
    "Perplexity Search at your service! I'm designed to find and synthesize information from across the web. Let me search for the most relevant and up-to-date information for you.",
    "I've searched multiple sources and found some interesting insights on your question. Here's what the latest research and data suggest.",
    "According to recent information, there are several perspectives on this topic. Let me present the most relevant findings for you."
  ],
  anthropic: [
    "Hello, I'm Claude 3.5 Sonnet. I'm designed to be helpful, harmless, and honest. I excel at thoughtful analysis and nuanced responses. How can I assist you today?",
    "That's a thoughtful question. Let me explore this topic with care and provide a balanced perspective that considers different viewpoints.",
    "I appreciate your question. Let me think about this carefully and provide a response that addresses the key aspects while acknowledging the nuances involved."
  ],
  mistral: [
    "Mistral Large here. I'm optimized for efficiency and accuracy across a wide range of tasks. How can I help you today?",
    "Let me address your question directly. Based on my analysis, here are the key points to consider.",
    "I'll provide a concise but comprehensive answer to your question, focusing on the most relevant information."
  ]
};

function App() {
  // State for user message
  const [userMessage, setUserMessage] = useState('');
  
  // Model states
  const [enabledModels, setEnabledModels] = useState<string[]>(['gpt', 'gemini']);
  const [typingModels, setTypingModels] = useState<string[]>([]);
  
  // Fresh stream manager (shared across all models)
  const streamManagerRef = useRef<FreshStreamManager | null>(null);
  
  // Sidebar state
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  
  // NEW: Stacked conversation history per model
  const [modelConversations, setModelConversations] = useState<Record<string, ChatMessage[]>>({});
  
  // Chat history state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  // Initialize NVIDIA API and stream batcher
  useEffect(() => {
    initializeNvidiaAPI().then((verified: boolean) => {
      if (verified) {
        console.log('✅ NVIDIA API initialized successfully');
      } else {
        console.warn('⚠️ NVIDIA API verification failed - will use fallback');
      }
    });
    
    // Initialize fresh stream manager
    streamManagerRef.current = new FreshStreamManager();
    
    return () => {
      if (streamManagerRef.current) {
        streamManagerRef.current.clearAll();
      }
    };
  }, []);
  
  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        setChatSessions(sessions);
      } catch (e) {
        console.error('Failed to load chat sessions:', e);
      }
    }
  }, []);
  
  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);
  
  // Toggle model enabled/disabled
  const handleToggleModel = useCallback((modelId: string) => {
    setEnabledModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        return [...prev, modelId];
      }
    });
  }, []);
  
  // Load a session
  const handleLoadSession = useCallback((sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setModelConversations(session.messages || {});
    }
  }, [chatSessions]);
  
  // Create a new session
  const handleNewSession = useCallback(() => {
    setCurrentSessionId(null);
    setModelConversations({});
    setUserMessage('');
  }, []);
  
  // Delete a session
  const handleDeleteSession = useCallback((sessionId: string) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      handleNewSession();
    }
  }, [currentSessionId, handleNewSession]);
  
  // Prepare models data for ModelCardContainer (optimized)
  const modelsForCards = useMemo(() => {
    return modelData.map(model => ({
      ...model,
      isTyping: typingModels.includes(model.id),
      conversation: modelConversations[model.id] || []
    }));
  }, [typingModels, modelConversations]);
  
  // Handle chat submission with optimized streaming
  const handleChatSubmit = useCallback(async (message: string) => {
    setUserMessage(message);
    
    // Create or update session
    const sessionId = currentSessionId || `session_${Date.now()}`;
    const sessionTitle = message.split(' ').slice(0, 6).join(' ') + (message.split(' ').length > 6 ? '...' : '');
    
    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
    }
    
    // Set typing state for all enabled models
    setTypingModels(enabledModels.slice());
    
    // Initialize conversations with user message
    enabledModels.forEach(modelId => {
      setModelConversations(prev => ({
        ...prev,
        [modelId]: [
          ...(prev[modelId] || []),
          { user: message, ai: "Generating...", timestamp: Date.now() }
        ]
      }));
    });
    
    // Execute all model requests with FRESH streaming
    const modelPromises = enabledModels.map(async (modelId) => {
      try {
        const manager = streamManagerRef.current;
        if (!manager) return { modelId, success: false };
        
        // Start stream with optimized throttled updates for 60fps
        // ChatGPT-like smooth streaming with requestAnimationFrame sync
        const throttleDelay = 16; // 60fps (16.67ms) for smooth, natural animation
        
        const throttledUpdate = throttle((text: string) => {
          setModelConversations(prev => {
            const currentConversation = prev[modelId] || [];
            const updatedConversation = [...currentConversation];
            
            if (updatedConversation.length > 0) {
              const lastIndex = updatedConversation.length - 1;
              const prevMsg = updatedConversation[lastIndex];
              // Preserve original user and timestamp to avoid key churn/remounts
              updatedConversation[lastIndex] = {
                ...prevMsg,
                ai: text
              };
            }
            
            return {
              ...prev,
              [modelId]: updatedConversation
            };
          });
        }, throttleDelay);

        manager.start(modelId, throttledUpdate);
        
        // Handle different streaming types
        if (modelId === 'gpt' || modelId === 'gemini' || modelId === 'deepseek') {
          // NVIDIA API - sends cumulative text
          await fetchModelResponse(modelId, message, (cumulativeText: string) => {
            manager.addText(modelId, cumulativeText, true);
          });
        } else {
          // Mock response - character by character
          const typingDuration = Math.random() * 600 + 300;
          await new Promise(resolve => setTimeout(resolve, typingDuration));
          
          const responses = mockResponses[modelId] || ["I'm processing your request..."];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          // Stream character by character
          await streamChars(randomResponse, (char: string) => {
            manager.addText(modelId, char, false);
          }, 20);
        }
        
        // Complete streaming
        manager.complete(modelId);
        
        // Remove from typing state
        setTypingModels(prev => prev.filter(id => id !== modelId));
        
        return { modelId, success: true };
      } catch (error) {
        console.error(`${modelId} failed:`, error);
        
        // Update with error message
        setModelConversations(prev => {
          const currentConversation = prev[modelId] || [];
          const updatedConversation = [...currentConversation];
          
          if (updatedConversation.length > 0) {
            updatedConversation[updatedConversation.length - 1] = {
              user: message,
              ai: `⚠️ Error: ${error instanceof Error ? error.message : String(error)}`,
              timestamp: Date.now()
            };
          }
          
          return {
            ...prev,
            [modelId]: updatedConversation
          };
        });
        
        setTypingModels(prev => prev.filter(id => id !== modelId));
        return { modelId, success: false };
      }
    });
    
    // Wait for all models to complete
    await Promise.allSettled(modelPromises);
    
    // Update session with latest conversations
    setChatSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === sessionId);
      const newSession = { 
        id: sessionId, 
        title: sessionTitle, 
        timestamp: Date.now(), 
        modelsUsed: enabledModels,
        messages: modelConversations
      };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newSession;
        return updated;
      }
      
      return [newSession, ...prev];
    });
  }, [currentSessionId, enabledModels, modelConversations]);
  
  return (
    <div className="flex flex-col h-screen bg-background text-white overflow-hidden">
      {/* Background Effects - optimized */}
      <div className="fixed inset-0 z-0">
        <DotBackground />
        <ParticleBackground intensity="low" />
        <AnimatedGradientBackground />
      </div>
      
      {/* Sidebar */}
      <Sidebar 
        isExpanded={isSidebarExpanded}
        toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onLoadSession={handleLoadSession}
        onNewChat={handleNewSession}
        onClearHistory={() => {}}
      />
      
      {/* Main Content */}
      <main 
        id="main-content"
        className="flex-1 transition-all duration-300 relative flex flex-col"
        style={{ 
          marginLeft: isSidebarExpanded ? '280px' : '70px'
        }}
      >
        {/* Model Cards Container */}
        <div className="flex-1 p-4 pt-6 flex items-center justify-center">
          <ModelCardContainer 
            models={modelsForCards}
            enabledModels={enabledModels}
            onToggleModel={handleToggleModel}
          />
        </div>
        
        {/* Input Bar positioned below cards */}
        <div className="pb-6 px-4">
          <div className="flex justify-center">
            <div style={{ width: 'min(768px, 100%)', maxWidth: '768px' }}>
              <ChatInput 
                onSubmit={handleChatSubmit}
                sidebarExpanded={isSidebarExpanded}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
