import React, { useEffect, useRef } from 'react';

interface PerspectiveGridProps {
  gridColor?: string;
  speed?: number;
  gridSize?: number;
  className?: string;
  glowIntensity?: number;
}

export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  gridColor = 'rgba(255, 255, 255, 0.14)',
  speed = 0.5,
  gridSize = 40,
  className = '',
  glowIntensity = 0.8
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;
    let isVisible = true;

    let width = 1000;
    let height = 800;

    // Resize canvas to match display size
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 || ('ontouchstart' in window) || (navigator && navigator.maxTouchPoints > 0)
    );

    // Pause completely when off-screen for maximum battery and CPU performance
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = isVisible;
      isVisible = entry.isIntersecting;
      if (isVisible && !wasVisible && !isMobile) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    }, { threshold: 0.05 });
    observer.observe(canvas);

    const render = () => {
      if (!canvas || !ctx || !isVisible) return;

      ctx.clearRect(0, 0, width, height);

      const horizonY = height * 0.38;
      const vanishingPointX = width * 0.5;

      offset = (offset + speed) % gridSize;

      // Draw horizontal grid lines (perspective compressed toward horizon)
      const totalHorizontalLines = 18;
      for (let i = 0; i < totalHorizontalLines; i++) {
        const progress = Math.pow((i + offset / gridSize) / totalHorizontalLines, 2.2);
        const y = horizonY + progress * (height - horizonY);
        const alpha = progress * 0.75;

        ctx.beginPath();
        ctx.strokeStyle = gridColor.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.lineWidth = 1;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw vertical perspective rays radiating from vanishing point
      const totalVerticalLines = Math.min(24, Math.floor(width / gridSize) + 4);
      for (let i = -totalVerticalLines; i <= totalVerticalLines; i++) {
        const bottomX = vanishingPointX + i * (gridSize * 1.8);

        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.moveTo(vanishingPointX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizon ambient glow
      const gradient = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 80);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${0.08 * glowIntensity})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, horizonY - 40, width, 120);

      // Vignette / fade mask at edges
      const vignette = ctx.createRadialGradient(
        vanishingPointX,
        horizonY,
        width * 0.1,
        vanishingPointX,
        horizonY,
        width * 0.85
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      if (!isMobile) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [gridColor, speed, gridSize, glowIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
