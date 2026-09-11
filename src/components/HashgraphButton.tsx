import React from 'react';

interface HashgraphButtonProps {
  children: React.ReactNode;
  hoverText?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  small?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const HashgraphButton: React.FC<HashgraphButtonProps> = ({
  children,
  hoverText,
  onClick,
  href,
  target,
  small = false,
  className = '',
  type = 'button'
}) => {
  const content = (
    <>
      <span className="btn__wrapper">
        <span className="btn__label btn__label--base">{children}</span>
        <span className="btn__label btn__label--hover">{hoverText || children}</span>
      </span>

      <svg className="btn__svg" fill="none" aria-hidden="true" preserveAspectRatio="none">
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="6"
          ry="6"
          stroke="url(#btnBorderGrad)"
        />
      </svg>

      <span className="btn__shimmer">
        <span className="btn__shimmer-inner" />
      </span>
    </>
  );

  const classes = `btn ${small ? 'btn--small' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={target === '_blank' ? 'noreferrer' : undefined} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {content}
    </button>
  );
};
