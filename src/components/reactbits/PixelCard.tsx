import React, { useRef, useState, useEffect } from 'react';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gridSize?: number;
  pixelColor?: string;
  activeColor?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  className = '',
  gridSize = 24,
  pixelColor = 'rgba(255, 255, 255, 0.04)',
  activeColor = 'rgba(255, 255, 255, 0.35)',
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;

    const draw = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cols = Math.ceil(rect.width / gridSize);
      const rows = Math.ceil(rect.height / gridSize);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gridSize;
          const y = r * gridSize;

          let dist = Infinity;
          if (mousePos) {
            const centerX = x + gridSize / 2;
            const centerY = y + gridSize / 2;
            dist = Math.hypot(centerX - mousePos.x, centerY - mousePos.y);
          }

          if (dist < 120) {
            const factor = Math.max(0, 1 - dist / 120);
            ctx.fillStyle = activeColor.replace(/[\d.]+\)$/, `${factor * 0.45})`);
            ctx.fillRect(x + 2, y + 2, gridSize - 4, gridSize - 4);
          } else {
            ctx.fillStyle = pixelColor;
            ctx.fillRect(x + 1, y + 1, 1.5, 1.5);
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [mousePos, gridSize, pixelColor, activeColor]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C0F16]/90 backdrop-blur-xl transition-all duration-300 ${className}`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full z-10"
        aria-hidden="true"
      />
      <div className="relative z-20 h-full w-full">
        {children}
      </div>
    </div>
  );
};
