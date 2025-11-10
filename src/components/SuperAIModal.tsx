import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Sparkles } from 'lucide-react';

interface SuperAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuperAIModal: React.FC<SuperAIModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative bg-gradient-to-br from-background via-background/95 to-black/90 rounded-2xl border-2 border-orange/30 max-w-md w-full overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange/10 via-transparent to-purple/10 pointer-events-none" />
              
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      background: ['#ff6b00', '#b366ff', '#00ffc6'][i % 3],
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-6">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-white/70" />
                </button>
                
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    className="relative"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange via-purple to-neonCyan rounded-full blur-xl opacity-50" />
                    <div className="relative bg-gradient-to-br from-orange/20 to-purple/20 p-6 rounded-full border-2 border-orange/50">
                      <Zap size={48} className="text-orange" />
                    </div>
                  </motion.div>
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-2 gradient-text">
                  Super AI Mode
                </h2>
                
                {/* Subtitle */}
                <p className="text-center text-white/60 mb-6">
                  Unleash the power of combined AI intelligence
                </p>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Sparkles size={20} className="text-orange mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm mb-1">Multi-Model Synthesis</h3>
                      <p className="text-xs text-white/60">Combines insights from all AI models</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Sparkles size={20} className="text-purple mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm mb-1">Enhanced Reasoning</h3>
                      <p className="text-xs text-white/60">Advanced logic and analysis capabilities</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <Sparkles size={20} className="text-neonCyan mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm mb-1">Optimized Responses</h3>
                      <p className="text-xs text-white/60">Best answers from collective intelligence</p>
                    </div>
                  </div>
                </div>
                
                {/* Coming Soon Badge */}
                <div className="text-center">
                  <motion.div
                    className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-orange/20 via-purple/20 to-neonCyan/20 border-2 border-orange/30"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 107, 0, 0.3)',
                        '0 0 40px rgba(179, 102, 255, 0.3)',
                        '0 0 20px rgba(255, 107, 0, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <span className="font-semibold gradient-text">Coming Soon</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuperAIModal;
