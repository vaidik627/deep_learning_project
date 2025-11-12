import React, { useEffect, useRef, memo } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

interface ParticleBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

// Use memo to prevent unnecessary re-renders
const ParticleBackground: React.FC<ParticleBackgroundProps> = memo(({ 
  intensity = 'low'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Professional color palette - minimal colors for performance
    const colors = ['#ffffff', '#00f5d4', '#9d4edd', '#ffb703', '#ffffff', '#ffffff'];

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Extremely reduced particle count for performance
    const getParticleCount = () => {
      switch (intensity) {
        case 'low': return 8;     // Minimal particles
        case 'medium': return 12;
        case 'high': return 15;   // Still much less than before
        default: return 8;
      }
    };

    // Initialize particles with optimized settings
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = getParticleCount();
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,  // Smaller size: 1-3px
          speedX: (Math.random() - 0.5) * 0.1,  // Much slower speed: 0.1
          speedY: (Math.random() - 0.5) * 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.08 + 0.02  // Very low opacity: 0.02-0.1
        });
      }
    };

    // Optimized animation function with throttling
    const animate = (timestamp: number) => {
      // Throttle to 30fps for performance
      if (timestamp - lastTimeRef.current < 33) { // ~30fps
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw all particles in a single batch for performance
      particlesRef.current.forEach((particle) => {
        // Update position (less frequently)
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Simple edge wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Simplified drawing - no filters, no complex effects
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    initParticles();
    animationRef.current = requestAnimationFrame(animate);

    // Optimized resize handler with debounce
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      clearTimeout(resizeTimeout);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
});

export default ParticleBackground;
