import React, { useEffect, useRef } from 'react';

interface SilkWavesProps {
  className?: string;
  speed?: number;
  waveCount?: number;
  amplitude?: number;
  frequency?: number;
  color?: string;
  opacity?: number;
}

export const SilkWaves: React.FC<SilkWavesProps> = ({
  className = '',
  speed = 0.008,
  waveCount = 5,
  amplitude = 45,
  frequency = 0.003,
  color = '255, 255, 255',
  opacity = 0.12
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    let isVisible = true;

    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    // Mobile optimization: Render static silk waves once to conserve mobile CPU & 120fps scrolling
    if (window.innerWidth < 640) {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < waveCount; i++) {
        const wavePhase = i * 1.35;
        const currentOpacity = (opacity / waveCount) * (i + 1);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${color}, ${currentOpacity})`;
        ctx.lineWidth = 1.2 + (i * 0.4);
        const centerY = height * 0.5 + (i - waveCount / 2) * 22;
        for (let x = 0; x <= width; x += 12) {
          const y1 = Math.sin(x * frequency + wavePhase) * amplitude;
          const y2 = Math.cos(x * (frequency * 0.7) + wavePhase) * (amplitude * 0.5);
          const y = centerY + y1 + y2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      return () => {
        window.removeEventListener('resize', resizeCanvas);
        observer.disconnect();
      };
    }

    const render = () => {
      if (!canvas || !ctx) return;

      if (isVisible) {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);
        step += speed;

        for (let i = 0; i < waveCount; i++) {
          const wavePhase = i * 1.35;
          const currentOpacity = (opacity / waveCount) * (i + 1);

          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color}, ${currentOpacity})`;
          ctx.lineWidth = 1.2 + (i * 0.4);

          const centerY = height * 0.5 + (i - waveCount / 2) * 22;

          for (let x = 0; x <= width; x += 6) {
            const y1 = Math.sin(x * frequency + step + wavePhase) * amplitude;
            const y2 = Math.cos(x * (frequency * 0.7) - step * 0.6 + wavePhase) * (amplitude * 0.5);
            const y = centerY + y1 + y2;

            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
  }, [speed, waveCount, amplitude, frequency, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
