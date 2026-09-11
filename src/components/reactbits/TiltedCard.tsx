import React, { useRef, useEffect } from 'react';

interface TiltedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glareEnable?: boolean;
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1000,
  scale = 1.015,
  glareEnable = true,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nx = (x / rect.width) * 2 - 1; // -1 to 1
    const ny = (y / rect.height) * 2 - 1; // -1 to 1

    const rotX = (-ny * maxTilt).toFixed(2);
    const rotY = (nx * maxTilt).toFixed(2);

    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
    cardRef.current.style.transition = 'transform 0.08s ease-out';

    if (glareEnable && glareRef.current) {
      const gx = ((x / rect.width) * 100).toFixed(1);
      const gy = ((y / rect.height) * 100).toFixed(1);
      glareRef.current.style.opacity = '0.28';
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.22) 0%, rgba(200, 210, 230, 0.05) 45%, transparent 80%)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    if (glareEnable && glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  };

  return (
    <div
      style={{ perspective: `${perspective}px` }}
      className="w-full h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
          willChange: 'transform'
        }}
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0F1015]/90 backdrop-blur-2xl shadow-2xl transition-shadow duration-300 hover:shadow-white/10 ${className}`}
        {...props}
      >
        {/* Dynamic Specular Holographic Glare */}
        {glareEnable && (
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-3xl"
            style={{
              opacity: 0,
              mixBlendMode: 'screen'
            }}
          />
        )}

        {/* Inner Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
