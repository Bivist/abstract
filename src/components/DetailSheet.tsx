import React from 'react';
import { Paper } from '../types';
import { OA_STATUS } from '../constants/taxonomy';
import { X, ExternalLink, Share2, Heart } from 'lucide-react';

interface DetailSheetProps {
  paper: Paper | null;
  onClose: () => void;
  isTranslating: boolean;
  langDict: Record<string, string>;
  onShare?: (paper: Paper) => void;
  isLiked?: boolean;
  onToggleLike?: (paper: Paper) => void;
  /** Paylaşılan bir bağlantıdan açıldıysa bilgi bandı gösterilir */
  isSharedView?: boolean;
}

export const DetailSheet: React.FC<DetailSheetProps> = ({
  paper,
  onClose,
  isTranslating,
  langDict,
  onShare,
  isLiked = false,
  onToggleLike,
  isSharedView = false
}) => {
  if (!paper) return null;

  const displayTitle = isTranslating && paper.trTitle ? paper.trTitle : paper.title;
  const displayAbs = isTranslating && paper.trAbs ? paper.trAbs : paper.abs;
  const oaLabel = paper.oa ? (OA_STATUS[paper.oa] || paper.oa) + (paper.oa === 'closed' ? '' : ' açık erişim') : '-';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[92dvh] bg-[#eef7fb] dark:bg-[#020f1a] rounded-t-3xl border-t border-[#c5dfe9] dark:border-[#0d2f45] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Grab bar */}
        <div className="w-10 h-1 bg-[#c5dfe9] dark:bg-[#0d2f45] rounded-full mx-auto my-2.5 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[#c5dfe9] dark:border-[#0d2f45] shrink-0">
          <h3 className="font-serif text-lg font-bold text-[#0a2540] dark:text-[#e0f4ff]">
            {langDict.details_title || "Makale ayrıntıları"}
          </h3>
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                type="button"
                onClick={() => onShare(paper)}
                aria-label={langDict.share_btn || 'Paylaş'}
                title={langDict.share_btn || 'Paylaş'}
                className="h-8 px-3 rounded-full bg-sky-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-sky-700 active:scale-95 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{langDict.share_btn || 'Paylaş'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="w-8 h-8 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] flex items-center justify-center hover:bg-sky-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {isSharedView && (
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-sky-50 dark:bg-[#0c2d44] border border-sky-200 dark:border-sky-800 text-xs leading-relaxed text-[#0a2540] dark:text-[#e0f4ff]">
              <Share2 className="w-4 h-4 mt-0.5 shrink-0 text-sky-600 dark:text-sky-300" />
              <span>{langDict.shared_banner || 'Bu makale seninle paylaşıldı.'}</span>
            </div>
          )}

          {/* Field chip */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#dbeafe] text-[#0369a1] dark:bg-[#0c2d44] dark:text-[#7dd3fc]">
              {paper.sub || paper.field}
            </span>
            {paper.cross && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-600 text-white">
                ✦ {paper.cross}
              </span>
            )}
            {isTranslating && (
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium ml-auto">
                🐟 blup
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-[#0a2540] dark:text-[#e0f4ff]">
            {displayTitle}
          </h2>

          <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8]">
            <b>{paper.journal}</b> {paper.pub ? `· ${paper.pub}` : ''}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a7a96] dark:text-[#5fa8c8] block mb-0.5">
                Yayın Tarihi
              </span>
              <span className="font-semibold">{paper.date || paper.year}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a7a96] dark:text-[#5fa8c8] block mb-0.5">
                Erişim Durumu
              </span>
              <span className="font-semibold">{oaLabel}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a7a96] dark:text-[#5fa8c8] block mb-0.5">
                Atıf Sayısı
              </span>
              <span className="font-semibold text-sky-600 dark:text-sky-400 tabular-nums">
                {paper.cites.toLocaleString("tr-TR")} atıf
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4a7a96] dark:text-[#5fa8c8] block mb-0.5">
                Kaynakça
              </span>
              <span className="font-semibold tabular-nums">{paper.refs} kaynak</span>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
              Özet
            </span>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45]">
              <p className="text-xs sm:text-sm leading-relaxed text-[#0a2540] dark:text-[#e0f4ff]">
                {displayAbs}
              </p>
            </div>
          </div>

          {/* Authors & Institutions */}
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
              Yazarlar &amp; Kurumlar
            </span>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] space-y-2">
              {paper.au && paper.au.length > 0 ? (
                paper.au.map((author, i) => (
                  <div key={i} className="text-xs">
                    <b className="text-[#0a2540] dark:text-[#e0f4ff]">{author.n}</b>
                    {author.i && (
                      <span className="block text-[11px] text-[#4a7a96] dark:text-[#5fa8c8] mt-0.5">
                        {author.i}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-[#4a7a96]">{paper.authors}</span>
              )}
            </div>
          </div>

          {/* Keywords */}
          {paper.kw && paper.kw.length > 0 && (
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
                Anahtar Kelimeler
              </span>
              <div className="flex flex-wrap gap-1.5">
                {paper.kw.map(k => (
                  <span
                    key={k}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45]"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-stretch gap-2 mt-4">
            {onToggleLike && (
              <button
                type="button"
                onClick={() => onToggleLike(paper)}
                aria-pressed={isLiked}
                className={`shrink-0 px-4 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isLiked
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white dark:bg-[#071828] border-[#c5dfe9] dark:border-[#0d2f45] text-rose-500 hover:border-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? (langDict.like_remove || 'Beğenildi') : (langDict.like_add || 'Beğen')}</span>
              </button>
            )}
            {paper.link && (
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-900/20 flex items-center justify-center gap-2 hover:opacity-95 transition-all"
              >
                <span>Makaleyi kaynağında aç</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
