import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface ModelBarProps {
  models: Model[];
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
}

const ModelBar: React.FC<ModelBarProps> = ({ models, selectedModels, onToggleModel }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-10 bg-gradient-to-b from-background/95 via-background/85 to-background/95 backdrop-blur-2xl border-b border-white/10 shadow-lg">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neonCyan/5 via-purple/5 to-orange/5 pointer-events-none" />
      
      <div className="ml-[70px] md:ml-[260px] transition-all duration-400 relative">
        {/* Left scroll button */}
        <motion.button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-md rounded-full p-1.5 border border-white/20 hover:border-neonCyan/50 transition-all"
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0, 255, 198, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={16} className="text-neonCyan" />
        </motion.button>

        {/* Right scroll button */}
        <motion.button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-md rounded-full p-1.5 border border-white/20 hover:border-neonCyan/50 transition-all"
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0, 255, 198, 0.3)' }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={16} className="text-neonCyan" />
        </motion.button>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto py-3 px-12 hide-scrollbar scroll-smooth"
        >
          <div className="flex gap-3">
            {models.map((model) => (
              <motion.button
                key={model.id}
                onClick={() => onToggleModel(model.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all whitespace-nowrap relative overflow-hidden ${
                  selectedModels.includes(model.id)
                    ? 'border-opacity-100'
                    : 'border-white/10 hover:border-white/30 bg-white/5'
                }`}
                style={{
                  borderColor: selectedModels.includes(model.id) ? model.color : '',
                  boxShadow: selectedModels.includes(model.id) ? `0 0 20px ${model.color}50, inset 0 0 20px ${model.color}10` : '',
                  background: selectedModels.includes(model.id) ? `linear-gradient(135deg, ${model.color}15, transparent)` : ''
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: selectedModels.includes(model.id) 
                    ? `0 0 25px ${model.color}60, inset 0 0 20px ${model.color}15` 
                    : '0 0 10px rgba(255, 255, 255, 0.1)'
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: models.indexOf(model) * 0.05 }}
              >
                {/* Animated background for selected */}
                {selectedModels.includes(model.id) && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${model.color}20, transparent 70%)`
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                
                <motion.div 
                  className="w-3 h-3 rounded-full relative z-10" 
                  style={{ backgroundColor: model.color }}
                  animate={selectedModels.includes(model.id) ? {
                    boxShadow: [
                      `0 0 5px ${model.color}`,
                      `0 0 15px ${model.color}`,
                      `0 0 5px ${model.color}`
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-sm font-medium relative z-10">{model.name}</span>
                {selectedModels.includes(model.id) && (
                  <motion.span 
                    className="w-2 h-2 rounded-full bg-current relative z-10" 
                    style={{ color: model.color }}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelBar;
