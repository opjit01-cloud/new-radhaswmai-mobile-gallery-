import React, { useRef, useState } from 'react';

export interface DockItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: number | string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
}

export const Dock: React.FC<DockProps> = ({
  items,
  className = '',
  panelHeight = 64,
  baseItemSize = 44,
  magnification = 60
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={dockRef}
      onMouseLeave={() => setHoveredIdx(null)}
      style={{ height: `${panelHeight}px` }}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-3.5 rounded-full bg-white/90 dark:bg-[#0B0C10]/90 backdrop-blur-2xl border border-neutral-200/90 dark:border-white/15 shadow-xl shadow-black/10 dark:shadow-2xl dark:shadow-black/90 transition-all ${className}`}
    >
      {items.map((item, idx) => {
        const isHovered = hoveredIdx === idx;
        const isNeighbor = hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1;
        const scale = isHovered ? 1.18 : isNeighbor ? 1.08 : 1.0;
        const translateY = isHovered ? -8 : isNeighbor ? -3 : 0;

        return (
          <div key={idx} className="relative group">
            {/* Tooltip */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-neutral-900/95 dark:bg-[#18181B]/95 text-white text-[10px] font-semibold tracking-wider uppercase border border-neutral-700 dark:border-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-10">
              {item.label}
            </div>

            <button
              onClick={item.onClick}
              onMouseEnter={() => setHoveredIdx(idx)}
              style={{
                width: `${baseItemSize}px`,
                height: `${baseItemSize}px`,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.18s ease'
              }}
              className={`relative flex items-center justify-center rounded-2xl cursor-pointer will-change-transform ${
                isHovered
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-lg font-bold border border-neutral-800 dark:border-white'
                  : 'bg-neutral-100/90 hover:bg-neutral-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-neutral-200/70 dark:border-white/10'
              }`}
            >
              {item.icon}

              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-mono font-bold px-1 shadow-md">
                  {item.badge}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

