import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ClickSpark } from '../reactbits/ClickSpark';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radhaswami_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
    try {
      localStorage.setItem('radhaswami_theme', theme);
    } catch {}
    window.dispatchEvent(new CustomEvent('radhaswami_theme_changed', { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ClickSpark sparkColor={theme === 'dark' ? '#FBBF24' : '#60A5FA'} sparkCount={8}>
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all duration-300 cursor-pointer select-none active:scale-95 shrink-0 ${
          theme === 'dark'
            ? 'bg-[#151922] hover:bg-[#1C222E] border-white/15 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
            : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-300 text-neutral-800 shadow-xs'
        } ${className}`}
        title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Noir Theme'}
        aria-label="Toggle theme"
      >
        <div className="relative w-4 h-4 sm:w-4 sm:h-4 flex items-center justify-center">
          {theme === 'dark' ? (
            <Sun size={15} className="text-amber-400 animate-spin-slow transform hover:rotate-45 transition-transform" />
          ) : (
            <Moon size={15} className="text-neutral-700 transform hover:-rotate-12 transition-transform" />
          )}
        </div>

        {showLabel && (
          <span className="hidden md:inline text-[10.5px] uppercase tracking-wider font-semibold">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        )}
      </button>
    </ClickSpark>
  );
};
