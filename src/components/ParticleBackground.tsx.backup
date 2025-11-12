import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

interface ParticleBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  containerClassName?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ 
  intensity = 'medium',
  containerClassName = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Define colors based on our theme
    const colors = ['#00ffc6', '#ff6b00', '#b366ff', '#00ff8f'];

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Adjust particle count based on intensity
    const getParticleCount = () => {
      switch (intensity) {
        case 'low': return 30;
        case 'high': return 100;
        default: return 50;
      }
    };

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = getParticleCount();
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
      });
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 ${containerClassName}`}
    />
  );
};

export default ParticleBackground;
