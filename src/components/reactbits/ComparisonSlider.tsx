import React, { useState, useRef, useCallback } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'iPhone 16 Pro Max',
  afterLabel = 'Galaxy S25 Ultra',
  className = ''
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPos(percent);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      className={`relative select-none overflow-hidden rounded-3xl border border-white/10 bg-black cursor-ew-resize shadow-2xl ${className}`}
    >
      {/* After Image (Full Base) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold font-mono border border-white/10">
        {afterLabel}
      </div>

      {/* Before Image (Clipped Left Layer) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: containerRef.current?.offsetWidth || '100%' }}
        />
        <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-black text-[10px] sm:text-xs font-bold font-mono shadow-md">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-1 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        style={{ left: `calc(${sliderPos}% - 0.5px)` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Center Grab Handle Pill */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-black shadow-xl flex items-center justify-center font-bold text-xs border border-neutral-300">
          ↔
        </div>
      </div>
    </div>
  );
};
