import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = ''
}) => {
  return (
    <span
      className={`inline-block relative overflow-hidden bg-clip-text text-transparent text-neutral-900 dark:text-white ${
        disabled ? 'text-gray-400' : ''
      } ${className}`}
      style={
        disabled
          ? {}
          : {
              backgroundImage:
                'var(--shiny-gradient, linear-gradient(120deg, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.4) 70%))',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              animation: `shiny-sweep ${speed}s linear infinite`
            }
      }
    >
      {text}
    </span>
  );
};
