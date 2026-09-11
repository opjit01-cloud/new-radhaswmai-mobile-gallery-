import React, { useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  life: number;
}

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#FFFFFF',
  sparkSize = 3,
  sparkCount = 8,
  duration = 400,
  children,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sparks: Spark[] = [];
    for (let i = 0; i < sparkCount; i++) {
      sparks.push({
        x,
        y,
        angle: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 3,
        size: sparkSize * (0.6 + Math.random() * 0.8),
        life: 1
      });
    }

    let startTime: number | null = null;
    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (progress < 1) {
        sparks.forEach((spark) => {
          spark.x += Math.cos(spark.angle) * spark.speed;
          spark.y += Math.sin(spark.angle) * spark.speed;
          spark.life = 1 - progress;

          ctx.fillStyle = sparkColor;
          ctx.globalAlpha = spark.life;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
          ctx.fill();
        });

        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-block ${className}`}
      style={{ overflow: 'visible' }}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="pointer-events-none absolute -top-[150px] -left-[150px] w-[400px] h-[400px] z-50"
      />
      {children}
    </div>
  );
};
