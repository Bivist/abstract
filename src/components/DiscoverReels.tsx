import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper } from '../types';
import { SFX } from '../utils/sfx';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { Heart, Info, ExternalLink, ChevronDown, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { BioluminescentAnglerfish } from './BioluminescentAnglerfish';

interface DiscoverReelsProps {
  queue: Paper[];
  likedPapers: Paper[];
  loading: boolean;
  onLikePaper: (paper: Paper) => void;
  onOpenDetails: (paper: Paper) => void;
  onOpenFilter: () => void;
  onFetchMore: () => void;
  filterSummary: string;
  isTranslating: boolean;
  langDict: Record<string, string>;
  onResetFilter?: () => void;
  onSharePaper?: (paper: Paper) => void;
}

export const DiscoverReels: React.FC<DiscoverReelsProps> = ({
  queue,
  likedPapers,
  loading,
  onLikePaper,
  onOpenDetails,
  onOpenFilter,
  onFetchMore,
  filterSummary,
  isTranslating,
  langDict,
  onResetFilter,
  onSharePaper
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [heartBurst, setHeartBurst] = useState(false);
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ x: number; y: number } | null>(null);
  const [dragDirection, setDragDirection] = useState<'idle' | 'vertical' | 'horizontal'>('idle');

  const controls = useAnimation();
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPaper = queue[currentIndex];
  const isLiked = currentPaper ? likedPapers.some(p => p.id === currentPaper.id) : false;

  // Auto-fetch more when running low on papers (memory window)
  useEffect(() => {
    if (queue.length - currentIndex < 4 && !loading) {
      onFetchMore();
    }
  }, [currentIndex, queue.length, loading, onFetchMore]);

  // Navigate to next paper with smooth spring animation
  const goToNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      SFX.up();
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, queue.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      SFX.left();
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleLike = useCallback(() => {
    if (!currentPaper) return;
    SFX.right();
    onLikePaper(currentPaper);
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 800);
  }, [currentPaper, onLikePaper]);

  // Touch & Pointer Gesture Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    SFX.init();
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    setDragDirection('idle');
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const deltaX = e.clientX - touchStartRef.current.x;
    const deltaY = e.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Double-tap detection for quick like
    if (absX < 8 && absY < 8) {
      const now = Date.now();
      if (now - lastTapRef.current < 300) {
        // Double tap occurred!
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDoubleTapHeart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          });
          setTimeout(() => setDoubleTapHeart(null), 800);
        }
        handleLike();
      }
      lastTapRef.current = now;
      return;
    }

    // Determine primary swipe vector
    if (absY > absX && absY > 45) {
      // VERTICAL SWIPE:
      // The user specifically requested: "instagram reelslarındaki gibi makaleleri aşağı kaydırarak geçeceğiz"
      // Swiping down (deltaY > 45) transitions to next paper.
      // Also allow swiping up (deltaY < -45) so both directions feel natural to users.
      if (deltaY > 45 || deltaY < -45) {
        goToNext();
      }
    } else if (absX > absY && absX > 50) {
      // HORIZONTAL SWIPE:
      // "eğer beğenilen olursa sağa kaydıracak eğer detaylı bilgi isterse sola kaydıracak"
      if (deltaX > 50) {
        // SWIPE RIGHT -> LIKE
        handleLike();
      } else if (deltaX < -50 && currentPaper) {
        // SWIPE LEFT -> OPEN DETAILS
        SFX.up();
        onOpenDetails(currentPaper);
      }
    }

    setDragDirection('idle');
  };

  return (
    <div
      ref={containerRef}
      data-tour="disc-stage"
      className="flex-1 flex flex-col h-full overflow-hidden select-none relative bg-gradient-to-b from-[#eef7fb] to-[#dff0f7] dark:from-[#020f1a] dark:to-[#071828]"
    >
      {/* Top Floating Filter Banner */}
      <div className="absolute top-2 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-[#071828]/85 backdrop-blur-md border border-[#c5dfe9]/80 dark:border-[#0d2f45] text-[#0369a1] dark:text-[#38bdf8] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span className="truncate max-w-[170px]">{filterSummary || langDict.sum_default || "Tüm alanlar"}</span>
        </span>

        <button
          type="button"
          onClick={onOpenFilter}
          data-tour="disc-filter"
          className="px-3 py-1 rounded-full bg-white/80 dark:bg-[#071828]/85 backdrop-blur-md border border-[#c5dfe9]/80 dark:border-[#0d2f45] text-xs font-semibold text-[#0a2540] dark:text-[#e0f4ff] shadow-sm hover:border-sky-500 transition-colors"
        >
          {langDict.filter_btn || "Filtrele"}
        </button>
      </div>

      {/* Floating Heart Burst for Likes */}
      <AnimatePresence>
        {heartBurst && (
          <motion.div
            initial={{ scale: 0.3, opacity: 1, y: 0 }}
            animate={{ scale: 2.2, opacity: 0, y: -70 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none text-rose-500 text-8xl drop-shadow-lg"
          >
            ♥
          </motion.div>
        )}
        {doubleTapHeart && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{ left: doubleTapHeart.x - 32, top: doubleTapHeart.y - 32 }}
            className="absolute z-40 pointer-events-none text-rose-500 text-6xl drop-shadow-md"
          >
            ♥
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading or Deep Sea Bioluminescent Anglerfish Empty State */}
      {!currentPaper && (
        loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-[#4a7a96] dark:text-[#5fa8c8] gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-sky-300 dark:border-sky-800 border-t-sky-600 animate-spin" />
            <span className="text-sm font-medium">{langDict.loading_articles || "Makaleler yükleniyor…"}</span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col p-3">
            <BioluminescentAnglerfish
              onOpenFilter={onOpenFilter}
              onReset={onResetFilter}
              message="Akış modunda başka makale kalmadı. Fenerbalığı karanlıkta parıldıyor."
            />
          </div>
        )
      )}

      {/* Immersive Vertical Reel Card */}
      {currentPaper && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPaper.id}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 280, mass: 0.8 }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="flex-1 relative m-3 mt-12 mb-3 bg-white/95 dark:bg-[#071828]/95 backdrop-blur-md border border-[#c5dfe9] dark:border-[#0d2f45] rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between touch-none overflow-hidden"
          >
            {/* Top Reel Header Tags */}
            <div className="flex items-center gap-2 flex-wrap z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#dbeafe] text-[#0369a1] dark:bg-[#0c2d44] dark:text-[#7dd3fc]">
                {currentPaper.sub || currentPaper.field}
              </span>
              {currentPaper.cross && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-600 to-cyan-500 text-white">
                  ✦ {currentPaper.cross}
                </span>
              )}
              {isTranslating && (
                <span className="ml-auto text-xs font-medium text-cyan-600 dark:text-cyan-400 flex items-center gap-1 animate-pulse">
                  🐟 blup
                </span>
              )}
            </div>

            {/* Central Article Content Area */}
            <div className="flex-1 my-3 overflow-y-auto no-scrollbar flex flex-col justify-center z-10 pr-12">
              <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-[#0a2540] dark:text-[#e0f4ff] mb-3">
                {isTranslating && currentPaper.trTitle ? currentPaper.trTitle : currentPaper.title}
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-[#4a7a96] dark:text-[#5fa8c8] line-clamp-10 sm:line-clamp-12">
                {isTranslating && currentPaper.trAbs ? currentPaper.trAbs : currentPaper.abs}
              </p>
            </div>

            {/* Bottom Meta & Author Information */}
            <div className="pt-3 border-t border-[#c5dfe9] dark:border-[#0d2f45] flex items-center justify-between text-xs text-[#4a7a96] dark:text-[#5fa8c8] z-10 pr-12">
              <div className="min-w-0 pr-3">
                <b className="block text-sm text-[#0a2540] dark:text-[#e0f4ff] font-bold truncate">
                  {currentPaper.authors || "Yazar bilgisi yok"}
                </b>
                <span className="truncate block opacity-85 text-xs">
                  {currentPaper.journal} · {currentPaper.year}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sky-600 dark:text-sky-400 font-bold tabular-nums block text-sm">
                  {currentPaper.cites.toLocaleString("tr-TR")} atıf
                </span>
              </div>
            </div>

            {/* Right-Side Floating Action Rails (Reels Style) */}
            <div className="absolute right-3.5 bottom-6 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
              {/* Like Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`w-11 h-11 rounded-full flex flex-col items-center justify-center transition-transform active:scale-80 shadow-md ${
                  isLiked
                    ? 'bg-rose-500 text-white'
                    : 'bg-[#dff0f7] dark:bg-[#0d2236] text-[#4a7a96] dark:text-[#5fa8c8] hover:text-rose-500'
                }`}
                title="Beğen (Sağa kaydır)"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              {/* Details Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails(currentPaper);
                }}
                className="w-11 h-11 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] text-[#4a7a96] dark:text-[#5fa8c8] hover:text-sky-600 flex items-center justify-center shadow-md transition-transform active:scale-80"
                title="Detaylı Bilgi (Sola kaydır)"
              >
                <Info className="w-5 h-5" />
              </button>

              {/* Share */}
              {onSharePaper && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSharePaper(currentPaper);
                  }}
                  className="w-11 h-11 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] text-[#4a7a96] dark:text-[#5fa8c8] hover:text-sky-600 flex items-center justify-center shadow-md transition-transform active:scale-80"
                  title={langDict.share_btn || 'Paylaş'}
                  aria-label={langDict.share_btn || 'Paylaş'}
                >
                  <Share2 className="w-4.5 h-4.5" />
                </button>
              )}

              {/* Source Link */}
              {currentPaper.link && (
              <a
                href={currentPaper.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-11 h-11 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] text-[#4a7a96] dark:text-[#5fa8c8] hover:text-sky-600 flex items-center justify-center shadow-md transition-transform active:scale-80"
                title="Kaynağında Aç"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              )}

              {/* Next Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="w-11 h-11 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30 transition-transform active:scale-80"
                title="Sonraki Makale (Aşağı kaydır)"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Gesture Guide Hint */}
            <div className="absolute bottom-2 left-5 z-10 pointer-events-none flex items-center gap-2 text-[10.5px] text-[#4a7a96]/75 dark:text-[#5fa8c8]/75 font-medium">
              <span>↓ Sonraki</span>
              <span>·</span>
              <span>→ Beğen</span>
              <span>·</span>
              <span>← Detay</span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Sitenin En Altındaki Telif & İmza Yazısı */}
      <footer className="text-center py-1 text-[11px] text-[#527993] dark:text-[#7bb0cc] bg-white/60 dark:bg-[#071828]/60 border-t border-[#c5dfe9]/30 dark:border-[#0d2f45]/30 shrink-0 select-none">
        <p>© 2026 Binali. Her hakkı saklıdır.</p>
      </footer>
    </div>
  );
};
