import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#FFFFFF', '#A1A1AA', '#FFFFFF', '#71717A', '#FFFFFF'],
  animationSpeed = 8,
  showBorder = false,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`,
  };

  return (
    <div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden ${
        showBorder ? 'border border-white/10 px-3.5 py-1.5' : ''
      } ${className}`}
    >
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .anim-gradient {
          background-size: 300% 100%;
          animation: gradient-shift ease infinite;
        }
      `}</style>
      <span
        className="anim-gradient inline-block bg-clip-text text-transparent font-bold tracking-tight"
        style={gradientStyle}
      >
        {children}
      </span>
    </div>
  );
};
