import React, { useEffect, useRef } from 'react';

const DotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Dot grid configuration
    const dotSpacing = 25; // Space between dots
    const dotRadius = 2; // Dot size
    const dotColor = 'rgba(255, 255, 255, 0.25)'; // Light white dots - more visible

    // Draw dot grid
    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();
        }
      }
    };

    drawDots();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default DotBackground;
