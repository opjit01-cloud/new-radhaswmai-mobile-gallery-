import React from 'react';

export const HashgraphSvgSprite: React.FC = () => {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
      <defs>
        <linearGradient id="btnBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9BB8E1" />
          <stop offset="100%" stopColor="#2C4E73" />
        </linearGradient>

        <linearGradient id="navBorderLeft" x1="0.5" y1="14.5" x2="65" y2="14.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9BB8E1" />
          <stop offset="1" stopColor="#235792" />
        </linearGradient>

        <linearGradient id="navBorderRight" x1="-34.5" y1="14.5" x2="30" y2="14.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9BB8E1" />
          <stop offset="1" stopColor="#235792" />
        </linearGradient>

        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#D4D4D8" />
          <stop offset="100%" stopColor="#71717A" />
        </linearGradient>
      </defs>
    </svg>
  );
};
