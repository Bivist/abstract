import React, { useState, useRef } from 'react';
import { Paper } from '../types';
import { SFX } from '../utils/sfx';
import { SlidersHorizontal, ArrowUp, Heart, X, Sparkles, ExternalLink, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BioluminescentAnglerfish } from './BioluminescentAnglerfish';

interface DiscoverClassicProps {
  queue: Paper[];
  loading: boolean;
  onSwipe: (dir: number) => void;
  onOpenDetails: (paper: Paper) => void;
  onOpenFilter: () => void;
  filterSummary: string;
  isTranslating: boolean;
  langDict: Record<string, string>;
  hasMore: boolean;
  onResetFilter?: () => void;
  onSharePaper?: (paper: Paper) => void;
}

export const DiscoverClassic: React.FC<DiscoverClassicProps> = ({
  queue,
  loading,
  onSwipe,
  onOpenDetails,
  onOpenFilter,
  filterSummary,
  isTranslating,
  langDict,
  onResetFilter,
  onSharePaper
}) => {
  const topPaper = queue[0];
  const behindPaper = queue[1];

  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);
  const pointerStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    SFX.init();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    pointerStart.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const { x, y } = dragOffset;
    // Swipe up threshold for details
    if (y < -75 && Math.abs(y) > Math.abs(x)) {
      setDragOffset({ x: 0, y: 0 });
      if (topPaper) onOpenDetails(topPaper);
      return;
    }

    // Horizontal swipe threshold
    if (Math.abs(x) > 90) {
      if (x > 0) {
        setHeartBurst(true);
        setTimeout(() => setHeartBurst(false), 700);
      }
      onSwipe(x > 0 ? 1 : -1);
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    // Tap without moving opens details
    if (Math.abs(x) < 6 && Math.abs(y) < 6 && topPaper) {
      onOpenDetails(topPaper);
    }

    setDragOffset({ x: 0, y: 0 });
  };

  const likeOpacity = Math.min(1, Math.max(0, dragOffset.x / 80));
  const nopeOpacity = Math.min(1, Math.max(0, -dragOffset.x / 80));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      {/* Top filter chip bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#071828] border-b border-[#c5dfe9] dark:border-[#0d2f45] shrink-0">
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-1.5 py-0.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#dbeafe] text-[#0369a1] dark:bg-[#0c2d44] dark:text-[#7dd3fc] whitespace-nowrap">
            <Sparkles className="w-3 h-3" />
            {filterSummary || langDict.sum_default || "Tüm alanlar · rastgele"}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenFilter}
          data-tour="disc-filter"
          className="px-3 py-1.5 rounded-xl bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45] text-xs font-semibold flex items-center gap-1.5 shrink-0 hover:border-sky-600 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{langDict.filter_btn || "Filtrele"}</span>
        </button>
      </div>

      {/* Main card stage */}
      <div data-tour="disc-stage" className="flex-1 relative m-2.5 min-h-0 flex items-center justify-center">
        {/* Heart particle pop on like */}
        <AnimatePresence>
          {heartBurst && (
            <motion.div
              initial={{ scale: 0.4, opacity: 1, y: 0 }}
              animate={{ scale: 1.5, opacity: 0, y: -60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute z-30 pointer-events-none text-7xl text-rose-500 font-bold"
            >
              ♥
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Spinner or Deep Sea Bioluminescent Anglerfish Empty State */}
        {!topPaper && (
          loading ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-[#4a7a96] dark:text-[#5fa8c8] gap-3">
              <div className="w-10 h-10 rounded-full border-3 border-sky-300 dark:border-sky-800 border-t-sky-600 animate-spin" />
              <span className="text-sm font-medium">{langDict.loading_articles || "Makaleler yükleniyor…"}</span>
            </div>
          ) : (
            <BioluminescentAnglerfish
              onOpenFilter={onOpenFilter}
              onReset={onResetFilter}
              message="Kaydırılacak makale kalmadı. Fenerbalığı biyo-lüminesans ışığıyla karanlıkta süzülüyor."
            />
          )
        )}

        {/* Behind Card */}
        {behindPaper && (
          <div
            className="absolute inset-0 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-3xl p-5 flex flex-col gap-3 shadow-md pointer-events-none transition-transform duration-200"
            style={{ transform: "scale(0.95) translateY(12px)", opacity: 0.45 }}
          >
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#dbeafe] text-[#0369a1] dark:bg-[#0c2d44] dark:text-[#7dd3fc]">
                {behindPaper.sub || behindPaper.field}
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0a2540] dark:text-[#e0f4ff] line-clamp-2">
              {behindPaper.title}
            </h3>
            <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8] line-clamp-6 leading-relaxed">
              {behindPaper.abs}
            </p>
          </div>
        )}

        {/* Top Interactive Card */}
        {topPaper && (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="absolute inset-0 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-3xl p-5 flex flex-col gap-3 shadow-xl touch-none cursor-grab active:cursor-grabbing will-change-transform z-10"
            style={{
              transform: isDragging
                ? `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.45}px, 0) rotate(${dragOffset.x * 0.07}deg)`
                : 'translate3d(0, 0, 0)',
              transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* LIKE STAMP */}
            <div
              className="absolute top-5 right-5 px-3 py-1 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm rounded-xl tracking-wider uppercase rotate-6 pointer-events-none transition-opacity"
              style={{ opacity: likeOpacity }}
            >
              BEĞENDİM
            </div>

            {/* PASS STAMP */}
            <div
              className="absolute top-5 left-5 px-3 py-1 border-2 border-rose-500 text-rose-600 dark:text-rose-400 font-extrabold text-sm rounded-xl tracking-wider uppercase -rotate-6 pointer-events-none transition-opacity"
              style={{ opacity: nopeOpacity }}
            >
              GEÇ
            </div>

            {/* Tags & Translation badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[#dbeafe] text-[#0369a1] dark:bg-[#0c2d44] dark:text-[#7dd3fc]">
                {topPaper.sub || topPaper.field}
              </span>
              {topPaper.cross && (
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-600 to-cyan-500 text-white">
                  ✦ Kesişim · {topPaper.cross}
                </span>
              )}
              {isTranslating && (
                <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 ml-auto animate-pulse flex items-center gap-1">
                  🐟 blup
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-[#0a2540] dark:text-[#e0f4ff]">
              {isTranslating && topPaper.trTitle ? topPaper.trTitle : topPaper.title}
            </h3>

            {/* Abstract with gradient mask */}
            <div className="flex-1 overflow-hidden relative">
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#4a7a96] dark:text-[#5fa8c8] [mask-image:linear-gradient(to_bottom,black_75%,transparent_100%)]">
                {isTranslating && topPaper.trAbs ? topPaper.trAbs : topPaper.abs}
              </p>
            </div>

            {/* Meta Footer */}
            <div className="pt-2 border-t border-[#c5dfe9] dark:border-[#0d2f45] flex items-center justify-between text-xs text-[#4a7a96] dark:text-[#5fa8c8]">
              <div className="min-w-0 pr-2">
                <b className="block text-[#0a2540] dark:text-[#e0f4ff] font-semibold truncate">
                  {topPaper.authors || "Yazar bilgisi yok"}
                </b>
                <span className="truncate block opacity-85">{topPaper.journal}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-semibold block">{topPaper.year}</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold tabular-nums">
                  {topPaper.cites.toLocaleString("tr-TR")} atıf
                </span>
              </div>
            </div>

            {/* Swipe hint */}
            <div className="text-center text-[11px] text-[#4a7a96]/70 dark:text-[#5fa8c8]/70 pt-0.5">
              ▲ Ayrıntı için yukarı kaydır veya tıkla
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div data-tour="disc-actions" className="flex items-center justify-center gap-5 py-2.5 px-4 bg-white dark:bg-[#071828] border-t border-[#c5dfe9] dark:border-[#0d2f45] shrink-0">
        <button
          type="button"
          onClick={() => onSwipe(-1)}
          aria-label="Geç"
          title="Geç"
          disabled={!topPaper}
          className="w-13 h-13 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45] text-rose-500 shadow-sm flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-90 disabled:opacity-40"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => topPaper && onOpenDetails(topPaper)}
          aria-label="Ayrıntılar"
          title="Ayrıntılar"
          disabled={!topPaper}
          className="w-11 h-11 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45] text-[#4a7a96] dark:text-[#5fa8c8] shadow-sm flex items-center justify-center text-base transition-all hover:scale-110 active:scale-90 disabled:opacity-40"
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
        </button>

        {onSharePaper && (
          <button
            type="button"
            onClick={() => topPaper && onSharePaper(topPaper)}
            aria-label={langDict.share_btn || 'Paylaş'}
            title={langDict.share_btn || 'Paylaş'}
            disabled={!topPaper}
            className="w-11 h-11 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45] text-[#4a7a96] dark:text-[#5fa8c8] shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-90 disabled:opacity-40"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onSwipe(1)}
          aria-label="Beğen"
          title="Beğen"
          disabled={!topPaper}
          className="w-13 h-13 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45] text-emerald-500 shadow-sm flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-90 disabled:opacity-40"
        >
          <Heart className="w-6 h-6 fill-emerald-500 stroke-none" />
        </button>
      </div>

      {/* Sitenin En Altındaki Telif & İmza Yazısı */}
      <footer className="text-center py-1.5 text-[11px] text-[#527993] dark:text-[#7bb0cc] bg-white dark:bg-[#071828] border-t border-[#c5dfe9]/40 dark:border-[#0d2f45]/40 shrink-0 select-none">
        <p>© 2026 Binali. Her hakkı saklıdır.</p>
      </footer>
    </div>
  );
};
