import React, { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 80,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.15
}) => {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
          }
        });
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <p ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((el, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700 ease-out will-change-transform"
          style={{
            opacity: inView ? 1 : 0,
            filter: inView ? 'blur(0px)' : 'blur(12px)',
            transform: inView
              ? 'translateY(0px)'
              : direction === 'top'
              ? 'translateY(-20px)'
              : 'translateY(20px)',
            transitionDelay: `${i * delay}ms`,
            marginRight: animateBy === 'words' ? '0.3em' : '0em'
          }}
        >
          {el}
        </span>
      ))}
    </p>
  );
};
