import React, { useRef, useState } from 'react';

interface GlareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glareColor?: string;
  maxTilt?: number;
}

export const GlareCard: React.FC<GlareCardProps> = ({
  children,
  className = '',
  glareColor = 'rgba(255, 255, 255, 0.25)',
  maxTilt = 12,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setRotate({ x: rotX, y: rotY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="inline-block w-full h-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d'
        }}
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0C0F16] transition-shadow duration-300 shadow-xl ${
          isHovered ? 'shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.06)]' : ''
        } ${className}`}
        {...props}
      >
        {/* Holographic Specular Diagonal Glare Sheet */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 65%), linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)`,
            mixBlendMode: 'overlay'
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
