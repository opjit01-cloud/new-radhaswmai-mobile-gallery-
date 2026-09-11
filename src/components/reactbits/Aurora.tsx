import React from 'react';

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  className?: string;
  speed?: number;
}

export const Aurora: React.FC<AuroraProps> = ({
  colorStops = ['#FFFFFF', '#94A3B8', '#334155', '#0B0F19'],
  amplitude = 1.0,
  blend = 0.35,
  className = '',
  speed = 14
}) => {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity: blend }}
    >
      {/* Layer 1: Liquid Platinum Flowing Wave */}
      <div
        className="absolute -inset-[50%] blur-[120px] opacity-25 animate-aurora-1"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colorStops[0]} 0%, ${colorStops[1]} 30%, transparent 65%)`,
          animationDuration: `${speed}s`
        }}
      />

      {/* Layer 2: Deep Titanium & Slate Secondary Wave */}
      <div
        className="absolute -inset-[50%] blur-[140px] opacity-20 animate-aurora-2"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${colorStops[1]} 0%, ${colorStops[2]} 40%, transparent 70%)`,
          animationDuration: `${speed * 1.4}s`
        }}
      />

      {/* Layer 3: Subtle Ethereal Accent Flare */}
      <div
        className="absolute -inset-[40%] blur-[160px] opacity-15 animate-aurora-3"
        style={{
          background: `radial-gradient(circle at 40% 60%, rgba(255, 255, 255, 0.25) 0%, ${colorStops[3]} 45%, transparent 75%)`,
          animationDuration: `${speed * 1.8}s`
        }}
      />
    </div>
  );
};

