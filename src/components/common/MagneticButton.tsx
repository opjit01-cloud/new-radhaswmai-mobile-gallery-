import React, { useRef, useState } from 'react';

type BaseProps = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    href?: never;
  };

type AnchorProps = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

export type MagneticButtonProps = ButtonProps | AnchorProps;

export const MagneticButton: React.FC<MagneticButtonProps> = (props) => {
  const { children, strength = 0.28, className = '', as = 'button', ...rest } = props;
  const btnRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: position.x === 0 && position.y === 0 
      ? 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
      : 'transform 0.08s ease-out'
  };

  if (as === 'a') {
    const anchorProps = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center justify-center cursor-pointer will-change-transform ${className}`}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center cursor-pointer will-change-transform ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
