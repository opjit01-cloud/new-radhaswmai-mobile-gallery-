import React, { useEffect, useState } from 'react';

export const HashgraphScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hidden md:flex scrollbar-track-v" aria-hidden="true">
      <div 
        className="scrollbar-fill-v"
        style={{ height: `${scrollProgress}%` }}
      />
    </div>
  );
};
