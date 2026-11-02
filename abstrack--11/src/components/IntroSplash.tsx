import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppIcon } from './AppIcon';

interface IntroSplashProps {
  onComplete: () => void;
  lang?: 'tr' | 'en';
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete, lang = 'tr' }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Logo 3 saniye ekranda kalır; kullanıcı "Geç" ile ya da dokunarak atlayabilir
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleExit = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={handleExit}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#eef7fb] dark:bg-[#020f1a] cursor-pointer select-none"
        >
          {/* Soft ambient pearl glow behind the logo */}
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-sky-400/20 to-cyan-300/15 dark:from-sky-500/15 dark:to-cyan-400/10 blur-3xl pointer-events-none" />

          {/* Centered user logo - purely the logo image itself without any text clutter */}
          <motion.div
            initial={{ scale: 0.82, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.06, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center pointer-events-none"
          >
            <AppIcon
              name="logo"
              size={116}
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain drop-shadow-[0_12px_28px_rgba(2,132,199,0.22)]"
              alt="Abstract Logo"
              fallback={
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white font-serif font-black text-4xl shadow-xl">
                  A
                </div>
              }
            />
          </motion.div>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleExit(); }}
            className="absolute bottom-10 right-6 px-4 py-2 rounded-full text-xs font-semibold bg-white/80 dark:bg-[#0c2d44]/80 border border-[#c5dfe9] dark:border-[#0d2f45] text-[#0369a1] dark:text-[#7dd3fc] shadow-sm backdrop-blur hover:bg-white dark:hover:bg-[#0c2d44]"
          >
            {lang === 'en' ? 'Skip' : 'Geç'} ›
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
