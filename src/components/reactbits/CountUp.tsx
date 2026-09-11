import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // in seconds
  separator?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 2,
  separator = ',',
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const [value, setValue] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTime: number | null = null;

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            
            // Ease-out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = from + (to - from) * easeProgress;
            
            setValue(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setValue(to);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [to, from, duration]);

  const formattedNumber = value
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  );
};
