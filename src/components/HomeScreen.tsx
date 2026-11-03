import React from 'react';
import { Sparkles, SlidersHorizontal, ChevronRight, Heart, Flame, Award, BookOpen, Activity } from 'lucide-react';
import { LighthouseWatchState } from '../types';

interface HomeScreenProps {
  onExplore: () => void;
  onOpenFilter: () => void;
  onGoLikes: () => void;
  onGoDashboard?: () => void;
  likesCount: number;
  langDict: Record<string, string>;
  reelsMode: boolean;
  lighthouseWatch: LighthouseWatchState;
  onUpdateDailyGoal: (goal: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onExplore,
  onOpenFilter,
  onGoLikes,
  onGoDashboard,
  likesCount,
  langDict,
  reelsMode,
  lighthouseWatch,
  onUpdateDailyGoal
}) => {
  // Motivational Lighthouse Keeper Rank based on streak & readings
  const getKeeperRank = (streak: number, total: number) => {
    if (streak >= 14 || total >= 50) return { title: 'Usta Kılavuz', icon: '🏆', color: 'text-amber-500' };
    if (streak >= 7 || total >= 25) return { title: 'Kıdemli Fenerci', icon: '🏮', color: 'text-sky-500' };
    if (streak >= 3 || total >= 10) return { title: 'Nöbetçi Gözcü', icon: '⚓', color: 'text-teal-500' };
    return { title: 'Çırak Fenerci', icon: '🌊', color: 'text-cyan-500' };
  };

  const rank = getKeeperRank(lighthouseWatch.streakDays, lighthouseWatch.totalReadCount);
  const isGoalReached = lighthouseWatch.todayReadCount >= lighthouseWatch.dailyGoal;
  const currentBeamPower = Math.min(100, Math.max(5, lighthouseWatch.beamPower || 20));
  const beamDistanceMiles = (currentBeamPower * 0.24).toFixed(1);

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto overscroll-contain px-4 py-4 space-y-3.5 max-w-lg mx-auto w-full select-none pb-8">
      {/* 1. Hero Banner matching reference image (Image 6) */}
      <div className="relative rounded-[28px] p-5 sm:p-6 text-white overflow-hidden shadow-lg shadow-sky-900/15 bg-gradient-to-br from-[#0284c7] via-[#0284c7] to-[#0ea5e9]">
        {/* Soft radial glow watermark */}
        <div className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-white/15 blur-2xl pointer-events-none" />

        {/* Right side vector Lighthouse illustration with warm beam & waves */}
        <div className="absolute right-0 bottom-0 w-[42%] h-full pointer-events-none flex items-end justify-end overflow-hidden">
          {/* Beaming light cone radiating from lighthouse lamp */}
          <div
            className="absolute right-12 bottom-14 w-60 h-32 origin-right pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: 'radial-gradient(ellipse at right center, rgba(254, 240, 138, 0.95) 0%, rgba(254, 240, 138, 0.45) 45%, rgba(254, 240, 138, 0) 80%)',
              transform: 'rotate(-7deg)'
            }}
          />

          <svg viewBox="0 0 160 200" className="w-full h-auto max-h-[175px] drop-shadow-md z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ambient beacon glow circle */}
            <circle cx="120" cy="50" r="16" fill="#fef08a" fillOpacity="0.4" className="animate-pulse" />

            {/* Lighthouse Tower Body (Tapered) */}
            <path d="M106 150L112 55H128L134 150H106Z" fill="#ffffff" />

            {/* Red Stripes on Tower */}
            <path d="M109 105L111 82H129L131 105H109Z" fill="#ef4444" />
            <path d="M107 140L108 122H132L133 140H107Z" fill="#ef4444" />

            {/* Lantern Room & Balcony Walkway */}
            <rect x="108" y="52" width="24" height="4" rx="1.5" fill="#0f172a" />
            <rect x="111" y="36" width="18" height="16" rx="2" fill="#0f172a" />
            <rect x="113" y="38" width="14" height="12" rx="1" fill="#fef08a" />
            <circle cx="120" cy="44" r="3" fill="#ffffff" />

            {/* Conical Roof Dome */}
            <path d="M110 36L120 18L130 36H110Z" fill="#0f172a" />
            <circle cx="120" cy="18" r="2.5" fill="#facc15" />

            {/* Rocky base */}
            <ellipse cx="120" cy="155" rx="26" ry="10" fill="#334155" />

            {/* Rolling Ocean Waves at Lighthouse Base */}
            <path d="M0 165 C30 155, 60 175, 90 162 C120 150, 140 170, 160 160 L160 200 L0 200 Z" fill="#0284c7" fillOpacity="0.85" />
            <path d="M0 175 C40 165, 80 185, 120 170 C140 162, 150 175, 160 168 L160 200 L0 200 Z" fill="#0369a1" fillOpacity="0.95" />
            <path d="M0 185 C30 180, 70 190, 110 182 C140 176, 150 185, 160 180 L160 200 L0 200 Z" fill="#0c4a6e" />
          </svg>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 max-w-[64%]">
          {reelsMode && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-cyan-200" />
              <span>Akış Modu</span>
            </div>
          )}

          <h2 className="font-serif text-[22px] sm:text-[25px] font-extrabold leading-[1.18] tracking-tight text-white drop-shadow-xs">
            Bilimi keşfet,<br />fenerin ışığında.
          </h2>
          <p className="mt-1.5 text-xs text-sky-100 font-normal leading-relaxed">
            Akademik makaleleri kaydır, beğen, geç, derinleş.
          </p>

          <div className="flex items-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={onExplore}
              data-tour="explore-btn"
              className="px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm bg-white text-[#0a2540] shadow-md shadow-sky-950/20 hover:bg-sky-50 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{langDict.hero_explore || "Keşfet"}</span>
            </button>
            <button
              type="button"
              onClick={onOpenFilter}
              data-tour="filter-btn"
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-white/20 border border-white/40 text-white hover:bg-white/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 backdrop-blur-xs shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{langDict.hero_filter || "Filtrele"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Beğenilenler Card - Matching reference image (Image 6) */}
      <button
        type="button"
        onClick={onGoLikes}
        className="flex items-center gap-3.5 sm:gap-4 bg-[#e9f4f9] dark:bg-[#071d2e] border border-[#d2e9f3] dark:border-[#0e3550] rounded-[24px] p-4 shadow-xs hover:border-[#0284c7]/50 dark:hover:border-[#38bdf8]/50 transition-all group text-left w-full"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff6b6b] to-[#f43f5e] text-white flex items-center justify-center shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform shrink-0">
          <Heart className="w-6 h-6 fill-white stroke-white" />
        </div>
        <div className="flex-1 min-w-0">
          <b className="block text-base font-bold text-[#0a2540] dark:text-[#f0f9ff]">
            {langDict.likes_title || "Beğenilenler"}
          </b>
          <span className="text-xs text-[#527993] dark:text-[#7bb0cc]">
            {likesCount} {langDict.items_saved || "makale kaydedildi"}
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-[#527993] dark:text-[#7bb0cc] group-hover:translate-x-1 transition-transform shrink-0" />
      </button>

      {/* 3. Fener Nöbeti: Günlük Okuma Hedefleri, Seri & Işık Gücü (Sleek, Legible & Balanced) */}
      <section className="bg-gradient-to-br from-[#f2f8fc] via-[#e8f3f9] to-[#dff0f8] dark:from-[#061b2c] dark:via-[#092339] dark:to-[#0c2c47] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-[24px] p-4 shadow-xs relative overflow-hidden">
        {/* Subtle decorative lighthouse watermark */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 dark:opacity-5 pointer-events-none text-[#0284c7]">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2L10 5H14L12 2ZM9 21H15M10 21L11 9H13L14 21M9 9H15M10 9L11 5H13L14 9M12 2L10 5H14L12 2Z" />
          </svg>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#0a2540] dark:text-[#f0f9ff] leading-tight">
                Fener Nöbeti
              </h3>
              <p className="text-[11px] text-[#527993] dark:text-[#7bb0cc]">
                Günlük Okuma ve Nöbet Serisi
              </p>
            </div>
          </div>

          {/* Streak pill badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold shadow-2xs shrink-0">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{lighthouseWatch.streakDays} Gün Seri</span>
          </div>
        </div>

        {/* Fener Huzmesi & BeamPower Dairesel İlerleme Halkası ve Doluluk Çubuğu */}
        <div className="bg-white/85 dark:bg-[#071a2b]/90 backdrop-blur-xs border border-sky-200/70 dark:border-sky-900/50 rounded-2xl p-3 shadow-xs mb-3">
          <div className="flex items-center gap-3.5">
            {/* Nautical Glowing Circular Progress Ring (64px) */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 70 70">
                <defs>
                  <linearGradient id="beamRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0284c7" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <filter id="beamRingGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.7" />
                  </filter>
                </defs>
                {/* Background Ring */}
                <circle
                  cx="35"
                  cy="35"
                  r="27"
                  stroke="currentColor"
                  strokeWidth="5.5"
                  fill="none"
                  className="text-sky-100 dark:text-sky-950/80"
                />
                {/* Foreground Animated Glowing Progress Arc */}
                <circle
                  cx="35"
                  cy="35"
                  r="27"
                  stroke="url(#beamRingGrad)"
                  strokeWidth="5.5"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#beamRingGlow)"
                  style={{
                    strokeDasharray: 169.6,
                    strokeDashoffset: 169.6 - (169.6 * currentBeamPower) / 100,
                    transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </svg>

              {/* Center Ring Percentage & Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[13px] font-black text-[#0284c7] dark:text-[#38bdf8] leading-none">
                  %{currentBeamPower}
                </span>
                <span className="text-[8px] font-bold text-[#527993] dark:text-[#7bb0cc] mt-0.5 uppercase tracking-tight">
                  Işık
                </span>
              </div>
            </div>

            {/* Beam Details & Real-Time Beam Fill Bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1 font-bold">
                <span className="text-[#0a2540] dark:text-[#f0f9ff] flex items-center gap-1.5 truncate">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
                  <span className="truncate">Fener Işık Huzmesi</span>
                </span>
                <span className="text-[#0284c7] dark:text-[#38bdf8] font-mono text-[11px] shrink-0">
                  {beamDistanceMiles} Mil
                </span>
              </div>

              {/* Parlayan Mavi Tonlu Doluluk Çubuğu */}
              <div className="relative w-full h-2.5 rounded-full bg-sky-200/50 dark:bg-sky-950/80 p-0.5 shadow-inner overflow-hidden border border-sky-300/40 dark:border-sky-800/40">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#38bdf8] shadow-[0_0_10px_rgba(56,189,248,0.7)] transition-all duration-700 relative"
                  style={{ width: `${currentBeamPower}%` }}
                >
                  <span className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/90 rounded-full blur-[1px] animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#527993] dark:text-[#7bb0cc] mt-1 font-medium">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#0284c7]" />
                  <span>{lighthouseWatch.todayReadCount} / {lighthouseWatch.dailyGoal} Okundu</span>
                </span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {isGoalReached ? "✨ Hedef Tamamlandı!" : `${Math.max(0, lighthouseWatch.dailyGoal - lighthouseWatch.todayReadCount)} makale kaldı`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Goal & Rank Footer */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-sky-200/50 dark:border-sky-900/40 text-xs">
          {/* Daily Goal Chips */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#527993] dark:text-[#7bb0cc]">
              Hedef:
            </span>
            <div className="inline-flex bg-sky-100/70 dark:bg-sky-950/70 p-0.5 rounded-lg border border-sky-200/60 dark:border-sky-900/50">
              {[3, 5, 10, 15].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onUpdateDailyGoal(g)}
                  className={`px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                    lighthouseWatch.dailyGoal === g
                      ? 'bg-[#0284c7] text-white shadow-2xs'
                      : 'text-[#4a7a96] dark:text-[#5fa8c8] hover:text-[#0284c7]'
                  }`}
                  title={`Günde ${g} makale hedefi`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Keeper Rank Badge */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0284c7] dark:text-[#38bdf8] bg-white/70 dark:bg-[#071a2b]/80 border border-sky-200/60 dark:border-sky-900/50 px-2.5 py-1 rounded-lg shrink-0">
            <Award className="w-3.5 h-3.5" />
            <span>{rank.title}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-75">{lighthouseWatch.totalReadCount} okuma</span>
          </div>
        </div>

        {/* Quick Link to Kişisel Seyir Panosu & Bilgi Ağı */}
        {onGoDashboard && (
          <button
            type="button"
            onClick={onGoDashboard}
            className="w-full mt-2.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#0284c7]/10 via-[#06b6d4]/15 to-[#0284c7]/10 hover:from-[#0284c7]/20 hover:to-[#06b6d4]/25 border border-sky-300/40 dark:border-sky-800/40 text-xs font-bold text-[#0284c7] dark:text-[#38bdf8] flex items-center justify-between active:scale-98 transition-all group"
          >
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#06b6d4]" />
              <span>Kişisel Seyir Panosu &amp; Bilgi Haritası</span>
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-[9px] font-bold uppercase tracking-wide">Yakında</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </section>

      {/* 4. Academic Stats with Watermarks - Exactly matching reference image (Image 6) */}
      <div className="grid grid-cols-3 bg-white dark:bg-[#071828] border border-[#cbe4f2] dark:border-[#0d2f45] rounded-[24px] overflow-hidden shadow-xs divide-x divide-[#cbe4f2] dark:divide-[#0d2f45] relative">
        {/* Column 1: Articles with subtle Lighthouse silhouette */}
        <div className="p-3.5 text-center relative overflow-hidden group">
          <div className="absolute right-1 bottom-1 text-[#0284c7]/10 dark:text-[#38bdf8]/10 pointer-events-none">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L10 5H14L12 2ZM9 21H15M10 21L11 9H13L14 21M10 9L11 5H13L14 9H10Z" />
            </svg>
          </div>
          <b className="block font-serif text-xl sm:text-2xl font-extrabold text-[#0a2540] dark:text-[#f0f9ff]">
            270M+
          </b>
          <span className="text-xs text-[#527993] dark:text-[#7bb0cc] font-medium mt-0.5 inline-block">
            {langDict.stat_articles || "Makale"}
          </span>
        </div>

        {/* Column 2: Journals with gentle water waves accent */}
        <div className="p-3.5 text-center relative overflow-hidden group">
          <b className="block font-serif text-xl sm:text-2xl font-extrabold text-[#0a2540] dark:text-[#f0f9ff]">
            50K+
          </b>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-xs text-[#527993] dark:text-[#7bb0cc] font-medium">
              {langDict.stat_journals || "Dergi"}
            </span>
          </div>
          <div className="w-10 h-1.5 mx-auto mt-1 opacity-40">
            <svg viewBox="0 0 40 6" fill="none" className="w-full h-full stroke-[#0284c7] dark:stroke-[#38bdf8]">
              <path d="M0 3 Q 10 0, 20 3 T 40 3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Column 3: Fields with ripple lines accent */}
        <div className="p-3.5 text-center relative overflow-hidden group">
          <b className="block font-serif text-xl sm:text-2xl font-extrabold text-[#0a2540] dark:text-[#f0f9ff]">
            26
          </b>
          <span className="text-xs text-[#527993] dark:text-[#7bb0cc] font-medium mt-0.5 inline-block">
            {langDict.stat_fields || "Alan"}
          </span>
          <div className="w-8 h-1.5 mx-auto mt-1 opacity-40">
            <svg viewBox="0 0 32 6" fill="none" className="w-full h-full stroke-[#0284c7] dark:stroke-[#38bdf8]">
              <path d="M0 3 Q 8 1, 16 3 T 32 3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 5. Sitenin En Altındaki Telif & İmza Yazısı */}
      <footer className="pt-2 pb-6 text-center border-t border-[#c5dfe9]/40 dark:border-[#0d2f45]/40">
        <p className="text-xs text-[#527993] dark:text-[#7bb0cc] font-medium tracking-wide">
          © 2026 Binali. Her hakkı saklıdır.
        </p>
      </footer>
    </div>
  );
};
