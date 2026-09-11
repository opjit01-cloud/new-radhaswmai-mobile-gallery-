import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TrueFocusProps {
  sentence?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  sentence = 'True Focus Animation',
  manualMode = false,
  blurAmount = 4,
  borderColor = '#FFFFFF',
  glowColor = 'rgba(255, 255, 255, 0.4)',
  animationDuration = 0.4,
  pauseBetweenAnimations = 1.8,
  className = ''
}) => {
  const words = sentence.split(' ');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (manualMode) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, (animationDuration + pauseBetweenAnimations) * 1000);

    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  useEffect(() => {
    if (currentIndex === null || currentIndex === -1) return;
    if (!wordRefs.current[currentIndex] || !containerRef.current) return;

    const parentRect = containerRef.current.getBoundingClientRect();
    const activeRect = wordRefs.current[currentIndex]!.getBoundingClientRect();

    setFocusRect({
      x: activeRect.left - parentRect.left,
      y: activeRect.top - parentRect.top,
      width: activeRect.width,
      height: activeRect.height
    });
  }, [currentIndex, words.length]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode) {
      setCurrentIndex(lastActiveIndex ?? 0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5 ${className}`}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => { wordRefs.current[index] = el; }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer transition-[filter,opacity] duration-300 select-none"
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isActive ? 1 : 0.45
            }}
          >
            {word}
          </span>
        );
      })}

      {/* Floating Focus Brackets Frame */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 border border-white/40 rounded-lg"
        animate={{
          x: focusRect.x - 6,
          y: focusRect.y - 4,
          width: focusRect.width + 12,
          height: focusRect.height + 8,
          opacity: currentIndex >= 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration,
          ease: [0.25, 1, 0.5, 1]
        }}
        style={{
          boxShadow: `0 0 16px ${glowColor}, inset 0 0 8px ${glowColor}`
        }}
      >
        {/* Corner Accents */}
        <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
        <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
        <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
        <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
      </motion.div>
    </div>
  );
};
