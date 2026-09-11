import React from 'react';

interface NoiseOverlayProps {
  opacity?: number;
  className?: string;
}

export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  opacity = 0.02,
  className = ''
}) => {
  // Completely disabled on touch / mobile devices for maximum 120Hz native smoothness
  const isTouchDevice = typeof window !== 'undefined' && (
    ('ontouchstart' in window) || (navigator && navigator.maxTouchPoints > 0)
  );

  if (isTouchDevice) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-40 hidden lg:block ${className}`}
      style={{
        opacity,
        background: 'radial-gradient(circle at 50% 50%, transparent 80%, rgba(0, 0, 0, 0.2) 100%)'
      }}
    />
  );
};
