import React, { memo } from 'react';
import { motion } from 'framer-motion';

// Use memo to prevent unnecessary re-renders
const AnimatedGradientBackground: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
      {/* Static gradient overlay - no animation for better performance */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,255,198,0.03), rgba(255,107,0,0.03), rgba(179,102,255,0.03))',
          transform: 'translateZ(0)', // Hardware acceleration
        }}
      />
      
      {/* Single slow-moving gradient orb - reduced for performance */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(0,255,198,0.2), transparent 70%)',
          willChange: 'transform', // Hardware acceleration
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -25, 0],
        }}
        transition={{
          duration: 30, // Slower animation
          repeat: Infinity,
          ease: 'easeInOut',
          // Optimize animation performance
          type: 'tween',
        }}
      />
    </div>
  );
});

export default AnimatedGradientBackground;
