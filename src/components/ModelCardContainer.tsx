import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  onClearModelChat: (modelId: string) => void;
}

const ModelCardContainer: React.FC<ModelCardContainerProps> = ({
  models,
  enabledModels,
  onToggleModel,
  onClearModelChat
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [models]);

  // Smooth scroll function
  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 420; // Width of one card + gap
      const newScrollLeft = direction === 'left'
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount;

      containerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
      containerRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    }
  };

  // Sort models: enabled first, disabled last
  const sortedModels = React.useMemo(() => {
    return [...models].sort((a, b) => {
      const aEnabled = enabledModels.includes(a.id);
      const bEnabled = enabledModels.includes(b.id);

      // Enabled models come first
      if (aEnabled && !bEnabled) return -1;
      if (!aEnabled && bEnabled) return 1;

      // Maintain original order within groups
      return 0;
    });
  }, [models, enabledModels]);

  const modelCards = sortedModels.map((model) => (
    <motion.div
      key={model.id}
      layout
      layoutId={model.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }}
      className="flex-shrink-0"
      style={{ width: '400px' }}
    >
      <ModelCard
        id={model.id}
        name={model.name}
        color={model.color}
        isEnabled={enabledModels.includes(model.id)}
        onToggle={() => onToggleModel(model.id)}
        onClearChat={() => onClearModelChat(model.id)}
        isTyping={model.isTyping}
        conversation={model.conversation || []}
      />
    </motion.div>
  ));

  return (
    <motion.div
      className="w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 hover:border-white/20 transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <ChevronLeft size={24} className="text-white" />
        </motion.button>
      )}

      {/* Right Scroll Button */}
      {canScrollRight && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80 hover:border-white/20 transition-all duration-200 shadow-lg hover:shadow-xl"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <ChevronRight size={24} className="text-white" />
        </motion.button>
      )}

      {/* Horizontal scrollable container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex gap-6 overflow-x-auto pb-4 px-6 scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
          WebkitOverflowScrolling: 'touch',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          scrollBehavior: 'smooth',
          // CRITICAL: Ensure scrolling always works
          pointerEvents: 'auto',
          touchAction: 'pan-x pan-y',
        }}
      >
        {modelCards}
      </div>

      {/* Scroll Indicators (Fade Edges) */}
      {canScrollLeft && (
        <div
          className="absolute left-0 top-0 bottom-4 w-16 pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(to right, rgba(13, 14, 16, 0.9), transparent)',
          }}
        />
      )}
      {canScrollRight && (
        <div
          className="absolute right-0 top-0 bottom-4 w-16 pointer-events-none z-[5]"
          style={{
            background: 'linear-gradient(to left, rgba(13, 14, 16, 0.9), transparent)',
          }}
        />
      )}
    </motion.div>
  );
};

export default ModelCardContainer;
