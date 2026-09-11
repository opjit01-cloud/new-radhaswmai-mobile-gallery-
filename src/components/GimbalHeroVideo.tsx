import React, { useEffect, useRef } from 'react';

interface GimbalHeroVideoProps {
  className?: string;
  children?: React.ReactNode;
}

export const GimbalHeroVideo: React.FC<GimbalHeroVideoProps> = ({
  className = '',
  children
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Smooth mouse follow variables
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});

    const isMobile = typeof window !== 'undefined' && (
      window.innerWidth < 768 ||
      ('ontouchstart' in window) ||
      (navigator && navigator.maxTouchPoints > 0)
    );

    // Track mouse coordinates on desktop for subtle 3D camera follow
    const handlePointerMove = (e: MouseEvent) => {
      if (isMobile) return;
      isInteractingRef.current = true;
      const clientX = e.clientX;
      const clientY = e.clientY;

      const w = window.innerWidth || 1000;
      const h = window.innerHeight || 800;
      const nx = (clientX / w) * 2 - 1; // -1 to 1
      const ny = (clientY / h) * 2 - 1; // -1 to 1

      mouseTargetRef.current = { x: nx, y: ny };
    };

    const handlePointerLeave = () => {
      isInteractingRef.current = false;
      mouseTargetRef.current = { x: 0, y: 0 };
    };

    let animId: number;
    if (!isMobile) {
      let isRunning = false;

      const renderLoop = () => {
        // Smooth lerp
        mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.06;
        mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.06;

        const rotY = mouseCurrentRef.current.x * 6;
        const rotX = -mouseCurrentRef.current.y * 4;
        const transX = mouseCurrentRef.current.x * 14;
        const transY = mouseCurrentRef.current.y * 10;

        if (video) {
          video.style.transform = `perspective(1000px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0) scale(1.04)`;
        }

        const dx = Math.abs(mouseTargetRef.current.x - mouseCurrentRef.current.x);
        const dy = Math.abs(mouseTargetRef.current.y - mouseCurrentRef.current.y);

        if (dx > 0.002 || dy > 0.002) {
          animId = requestAnimationFrame(renderLoop);
        } else {
          isRunning = false;
        }
      };

      const startLoop = () => {
        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(renderLoop);
        }
      };

      window.addEventListener('mousemove', (e) => {
        handlePointerMove(e);
        startLoop();
      }, { passive: true });
      document.addEventListener('mouseleave', () => {
        handlePointerLeave();
        startLoop();
      });
      startLoop();
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#FAFAFB] dark:bg-[#07080A] text-[#0A0B0E] dark:text-[#F8FAFC] transition-colors duration-300 ${className}`}
    >
      {/* 1. FULL-SCREEN BACKGROUND GIMBAL VIDEO & CANVAS STAGE (LUXURY WHITE & BLACK MIXTURE) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          src="/gimble_video.mp4"
          playsInline
          muted
          loop
          autoPlay
          preload="metadata"
          className="w-full h-full object-cover will-change-transform opacity-35 dark:opacity-25"
          style={{ transformOrigin: 'center center' }}
        />

        {/* Luminous Frosted Overlays adapting smoothly to Light & Dark Theme */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 pointer-events-none backdrop-blur-[1px] transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFB] dark:from-[#07080A] via-[#FAFAFB]/70 dark:via-[#07080A]/70 to-white/80 dark:to-transparent pointer-events-none transition-colors" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFB] dark:from-[#07080A] via-[#FAFAFB]/80 dark:via-[#07080A]/80 to-transparent pointer-events-none transition-colors" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FAFAFB] dark:from-[#07080A] via-[#FAFAFB]/90 dark:via-[#07080A]/90 to-transparent pointer-events-none transition-colors" />
      </div>

      {/* 2. FOREGROUND CONTENT LAYER */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>

    </div>
  );
};
