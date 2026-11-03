import React from 'react';
import { AppIcon } from './AppIcon';

interface TopBarProps {
  onGoHome: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  reelsMode?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onGoHome,
  isDark,
  onToggleTheme,
  reelsMode = false
}) => {
  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-2 bg-white dark:bg-[#071828] border-b border-[#c5dfe9]/60 dark:border-[#0d2f45] shadow-sm shadow-sky-950/5">
      {/* Brand & Logo Zone */}
      <button
        type="button"
        onClick={onGoHome}
        className="flex items-center gap-3 text-left group focus-visible:outline-2 focus-visible:outline-sky-600 rounded-xl transition-transform active:scale-95"
        title="Ana Sayfa"
      >
        {/* Squircle logo container matching reference */}
        <div className="w-14 h-14 rounded-2xl bg-[#f0f8fc] dark:bg-sky-950/50 border border-[#bde0f2] dark:border-sky-800 flex items-center justify-center p-1 shadow-sm">
          <AppIcon
            name="logo"
            size={44}
            className="w-11 h-11 object-contain"
            alt="Abstract Logo"
            fallback={
              <svg viewBox="0 0 40 40" className="w-11 h-11 fill-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" stroke="#0284c7" strokeWidth="2.5" />
                <path d="M12 28L20 12L28 28" stroke="#0284c7" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 23H25" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-[26px] font-bold tracking-tight text-[#0a2540] dark:text-[#f0f9ff]">
            Abstract
          </span>
          {reelsMode && (
            <span className="text-[9px] uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 -mt-1 font-sans">
              Akış Modu
            </span>
          )}
        </div>
      </button>

      {/* Right Controls: Circular Dark Navy Lighthouse Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleTheme}
          data-tour="theme-btn"
          aria-label="Tema değiştir"
          title={isDark ? "Gece Modu Açık (Fener Yanıyor) - Gündüze Geç" : "Gündüz Modu (Fener Kapalı) - Geceye Geç"}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md relative hover:scale-105 active:scale-95 transition-all border group ${
            isDark
              ? 'bg-[#051a2e] text-white border-sky-500/50 shadow-amber-500/10'
              : 'bg-[#0a2540] text-slate-300 border-sky-900/40'
          }`}
        >
          {/* Glowing pulse beacon light ONLY in dark mode */}
          {isDark && (
            <span className="absolute -top-0.5 right-1 w-2.5 h-2.5 rounded-full bg-amber-400/90 blur-xs animate-pulse" />
          )}
          
          <svg className="w-6 h-6 transition-transform group-hover:rotate-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Light beam triangles ONLY in dark mode */}
            {isDark && (
              <path
                d="M14 6L21 3M14 8L22 9M10 6L3 3M10 8L2 9"
                stroke="#fbbf24"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="filter drop-shadow-[0_0_3px_#fde047]"
              />
            )}
            
            {/* Lighthouse Tower Body */}
            <path
              d="M10 20L11 9H13L14 20"
              stroke="#ffffff"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Stripes */}
            <path d="M10.5 13H13.5" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M10.2 16.5H13.8" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
            {/* Base */}
            <path d="M8.5 20H15.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Lantern Room */}
            <path d="M10 9L11 5H13L14 9H10Z" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" fill="#ffffff" fillOpacity={isDark ? "0.2" : "0.08"} />
            {/* Roof Dome */}
            <path d="M10 5L12 2.5L14 5H10Z" fill={isDark ? "#38bdf8" : "#0284c7"} stroke={isDark ? "#38bdf8" : "#0284c7"} strokeWidth="1.2" strokeLinejoin="round" />
            {/* Lamp Beacon - Glowing warm yellow when dark, unlit slate when light */}
            <circle
              cx="12"
              cy="7"
              r="1.5"
              fill={isDark ? "#facc15" : "#64748b"}
              className={isDark ? "filter drop-shadow-[0_0_4px_#fde047]" : ""}
            />
          </svg>
        </button>
      </div>
    </header>
  );
};
