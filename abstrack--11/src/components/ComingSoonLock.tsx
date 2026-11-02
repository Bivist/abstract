import React from 'react';
import { Lock } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
}

// İçeriği siyah-beyaz ve etkileşimsiz gösterir; üstüne "Yakında" kartı koyar.
export const ComingSoonLock: React.FC<Props> = ({ children, title, description }) => (
  <div className="relative flex-1 min-h-0 overflow-hidden">
    <div
      className="absolute inset-0 flex flex-col overflow-hidden grayscale opacity-60 pointer-events-none select-none"
      aria-hidden="true"
      inert
    >
      {children}
    </div>
    <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-white/35 dark:bg-black/40 backdrop-blur-[1.5px]">
      <div className="max-w-xs w-full text-center rounded-3xl bg-white/95 dark:bg-[#071828]/95 border border-[#c5dfe9] dark:border-[#0d2f45] shadow-2xl px-6 py-7">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <Lock className="w-5 h-5 text-slate-600 dark:text-slate-200" />
        </div>
        <h3 className="font-serif text-lg font-bold text-[#0a2540] dark:text-[#e0f4ff]">{title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#4a7a96] dark:text-[#5fa8c8]">{description}</p>
      </div>
    </div>
  </div>
);
