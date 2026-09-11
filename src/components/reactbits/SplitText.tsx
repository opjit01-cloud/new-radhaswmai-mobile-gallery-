import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 0.05,
  duration = 0.5,
  animateBy = 'words',
  direction = 'bottom'
}) => {
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (customDelay = 0) => ({
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: customDelay
      }
    })
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: direction === 'bottom' ? 24 : -24,
      filter: 'blur(6px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  if (animateBy === 'letters') {
    return (
      <motion.span
        className={`inline-flex flex-wrap ${className}`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split('').map((char, charIndex) => (
              <motion.span
                key={charIndex}
                variants={itemVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {words.map((word, wordIndex) => (
        <motion.span
          key={wordIndex}
          variants={itemVariants}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};
