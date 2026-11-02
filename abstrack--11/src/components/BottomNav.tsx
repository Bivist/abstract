import React from 'react';
import { TabId } from '../types';
import { AppIcon } from './AppIcon';
import { Compass, Heart, Settings, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  langDict: Record<string, string>;
  likesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  langDict,
  likesCount
}) => {
  // Lighthouse SVG Icon for "Ana sayfa" matching reference image
  const LighthouseIcon = ({ active }: { active: boolean }) => (
    <svg className="w-5 h-5 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 21H15M10 21L11 9H13L14 21M9 9H15M10 9L11 5H13L14 9M12 2L10 5H14L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "currentColor" : "none"}
        fillOpacity={active ? "0.15" : "0"}
      />
      <circle cx="12" cy="7" r="1.5" fill={active ? "#0284c7" : "currentColor"} />
    </svg>
  );

  const tabs: {
    id: TabId;
    labelKey: string;
    iconName: 'home' | 'explore' | 'likes' | 'dashboard' | 'settings';
    renderIcon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      labelKey: 'tab_home',
      iconName: 'home',
      renderIcon: (active) => <LighthouseIcon active={active} />
    },
    {
      id: 'disc',
      labelKey: 'tab_explore',
      iconName: 'explore',
      renderIcon: (active) => <Compass className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
    },
    {
      id: 'likes',
      labelKey: 'tab_likes',
      iconName: 'likes',
      renderIcon: (active) => (
        <div className="relative">
          <Heart className={`w-5 h-5 ${active ? 'fill-[#ff6b6b] text-[#ff6b6b] stroke-[#ff6b6b]' : 'stroke-[1.8]'}`} />
          {likesCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#f43f5e] text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
            >
              {likesCount > 99 ? '99+' : likesCount}
            </motion.span>
          )}
        </div>
      )
    },
    {
      id: 'dashboard',
      labelKey: 'tab_dashboard',
      iconName: 'dashboard',
      renderIcon: (active) => (
        <svg className="w-5 h-5 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={active ? "2" : "1.6"} strokeDasharray="2 2" opacity="0.6" />
          <circle cx="12" cy="5" r="1.8" fill={active ? "#0284c7" : "currentColor"} />
          <circle cx="6" cy="16" r="1.8" fill={active ? "#0284c7" : "currentColor"} />
          <circle cx="18" cy="15" r="2.2" fill={active ? "#06b6d4" : "currentColor"} />
          <circle cx="12" cy="12" r="1.5" fill={active ? "#38bdf8" : "currentColor"} />
          <path d="M12 5L6 16M12 5L18 15M6 16L18 15M12 5L12 12" stroke="currentColor" strokeWidth="1.3" opacity={active ? "0.9" : "0.5"} />
        </svg>
      )
    },
    {
      id: 'sets',
      labelKey: 'tab_settings',
      iconName: 'settings',
      renderIcon: (active) => <Settings className={`w-5 h-5 ${active ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
    }
  ];

  return (
    <nav className="relative z-20 bg-white dark:bg-[#071828] px-3 pb-2 pt-2 shadow-[0_-6px_20px_rgba(2,132,199,0.06)] border-t border-[#c5dfe9]/40 dark:border-[#0d2f45]">
      {/* Gentle Oceanic Wavy Top Edge Contour */}
      <div className="absolute -top-[7px] left-0 right-0 h-[8px] pointer-events-none overflow-hidden leading-none">
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          className="w-full h-full fill-white dark:fill-[#071828] drop-shadow-[0_-2px_3px_rgba(2,132,199,0.04)]"
        >
          <path d="M0 12 C150 2, 300 2, 450 7 C600 12, 750 2, 900 6 C1050 10, 1150 3, 1200 8 L1200 12 L0 12 Z" />
        </svg>
      </div>

      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              data-tour={`nav-${tab.id}`}
              className="relative flex-1 py-1 px-1 flex flex-col items-center justify-center gap-1 min-h-[50px] transition-all group focus-visible:outline-hidden"
            >
              {/* Minimal Smooth Indicator Pill for Active Tab */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 mx-1 my-0.5 rounded-2xl bg-[#dff0f7] dark:bg-[#0c2d44]"
                />
              )}

              {/* Icon Container with subtle scale transition */}
              <div
                className={`relative z-10 transition-transform duration-200 ${
                  isActive
                    ? 'text-[#0284c7] dark:text-[#38bdf8] scale-105'
                    : 'text-[#527993] dark:text-[#7bb0cc] group-hover:text-[#0284c7] dark:group-hover:text-[#38bdf8]'
                }`}
              >
                <AppIcon
                  name={tab.iconName}
                  size={20}
                  className="w-5 h-5 object-contain"
                  alt={tab.labelKey}
                  fallback={tab.renderIcon(isActive)}
                />
              </div>

              {/* Tab Label */}
              <span
                className={`relative z-10 text-[11px] transition-all duration-200 leading-tight ${
                  isActive
                    ? 'text-[#0284c7] dark:text-[#38bdf8] font-bold'
                    : 'text-[#527993] dark:text-[#7bb0cc] font-medium'
                }`}
              >
                {langDict[tab.labelKey]}
                {tab.id === 'dashboard' && <Lock className="inline w-2.5 h-2.5 ml-0.5 -mt-0.5 opacity-70" />}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
