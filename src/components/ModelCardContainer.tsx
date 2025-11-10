import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import ModelCard from './ModelCard';

interface ChatMessage {
  user: string;
  ai: string;
  timestamp: number;
}

interface Model {
  id: string;
  name: string;
  color: string;
  isTyping?: boolean;
  conversation?: ChatMessage[];
}

interface ModelCardContainerProps {
  models: Model[];
  enabledModels: string[];
  onToggleModel: (modelId: string) => void;
}

const ModelCardContainer: React.FC<ModelCardContainerProps> = ({ 
  models, 
  enabledModels, 
  onToggleModel 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Scrollable container - smooth horizontal scroll */}
      <div 
        ref={containerRef}
        className="flex gap-2 overflow-x-auto py-2 px-1 hide-scrollbar snap-x snap-mandatory md:flex-row flex-col scroll-smooth"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {models.map((model) => (
          <div key={model.id} className="snap-start md:min-w-[320px] md:max-w-[400px] w-full flex-shrink-0">
            <ModelCard
              id={model.id}
              name={model.name}
              color={model.color}
              isEnabled={enabledModels.includes(model.id)}
              onToggle={() => onToggleModel(model.id)}
              isTyping={model.isTyping}
              conversation={model.conversation || []}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ModelCardContainer;
