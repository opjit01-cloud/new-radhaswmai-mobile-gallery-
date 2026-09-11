import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  delay = 0.08
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <AnimatePresence>
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          return (
            <motion.div
              key={child.key || index}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{
                duration: 0.35,
                delay: index * delay,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
