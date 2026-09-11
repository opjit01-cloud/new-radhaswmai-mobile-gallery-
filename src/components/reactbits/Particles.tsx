import React, { useEffect, useRef } from 'react';

interface ParticlesProps {
  particleCount?: number;
  particleColors?: string[];
  speed?: number;
  interactive?: boolean;
  className?: string;
  connectLines?: boolean;
}

export const Particles: React.FC<ParticlesProps> = ({
  particleCount = 50,
  particleColors = ['#FFFFFF', '#F1F5F9', '#CBD5E1', '#94A3B8'],
  speed = 0.35,
  interactive = true,
  className = '',
  connectLines = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);
    const count = isMobile ? Math.min(22, particleCount) : particleCount;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    if (interactive && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Particle pool
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * 2 + 0.8,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      alpha: Math.random() * 0.5 + 0.25,
      pulse: Math.random() * Math.PI * 2
    }));

    const render = () => {
      if (!isVisible) return;
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap around bounds
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse interaction attraction / repulse
        if (interactive && !isMobile) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= Math.cos(angle) * force * 1.8;
            p.y -= Math.sin(angle) * force * 1.8;
          }
        }

        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
        if (!isMobile) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
        }
        ctx.fill();

        // Connect nearby particles
        if (connectLines && !isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = '#FFFFFF';
              ctx.globalAlpha = (1 - dist / 80) * 0.08;
              ctx.lineWidth = 0.5;
              ctx.shadowBlur = 0;
              ctx.stroke();
            }
          }
        }
      }
    };

    // IntersectionObserver to pause loop when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (isVisible && !wasVisible) {
        cancelAnimationFrame(animId);
        render();
      } else if (!isVisible) {
        cancelAnimationFrame(animId);
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    render();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive && !isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [particleCount, particleColors, speed, interactive, connectLines]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};
