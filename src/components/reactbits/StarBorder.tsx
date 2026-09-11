import React from 'react';

interface StarBorderProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
}

export const StarBorder: React.FC<StarBorderProps> = ({
  as: Component = 'div',
  className = '',
  color = '#FFFFFF',
  speed = '6s',
  children,
  ...rest
}) => {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-3xl p-[1.5px] ${className}`}
      {...rest}
    >
      <style>{`
        @keyframes star-bottom {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-300%, 0); }
        }
        @keyframes star-top {
          0% { transform: translate(0, 0); }
          100% { transform: translate(300%, 0); }
        }
        .star-bottom-anim {
          animation: star-bottom linear infinite;
        }
        .star-top-anim {
          animation: star-top linear infinite;
        }
      `}</style>
      <div
        className="absolute w-[300%] h-[50%] opacity-60 bottom-[-10px] right-[-250%] rounded-full star-bottom-anim z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="absolute w-[300%] h-[50%] opacity-60 top-[-10px] left-[-250%] rounded-full star-top-anim z-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed,
        }}
      />
      <div className="relative z-1 w-full h-full rounded-3xl">
        {children}
      </div>
    </Component>
  );
};
