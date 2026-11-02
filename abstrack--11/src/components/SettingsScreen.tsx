import React from 'react';
import { SettingsState } from '../types';
import { Smartphone, Trash2, LogIn, LogOut, UserRound, Cloud } from 'lucide-react';

interface SettingsScreenProps {
  settings: SettingsState;
  onUpdateSettings: (updater: (prev: SettingsState) => SettingsState) => void;
  onClearLikes: () => void;
  onReplayTour?: () => void;
  langDict: Record<string, string>;
  /** Giriş özelliği (Supabase) yapılandırılmış mı? Değilse Hesap bölümü gizlenir. */
  authEnabled?: boolean;
  userEmail?: string | null;
  syncStatus?: 'idle' | 'syncing' | 'synced' | 'error';
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearLikes,
  onReplayTour,
  langDict,
  authEnabled = false,
  userEmail = null,
  syncStatus = 'idle',
  onOpenAuth,
  onSignOut
}) => {
  const syncText =
    syncStatus === 'syncing' ? (langDict.sync_syncing || 'Eşitleniyor…')
    : syncStatus === 'error' ? (langDict.sync_error || 'Eşitlenemedi, tekrar denenecek')
    : (langDict.sync_ok || 'Verilerin hesabında yedekleniyor');

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 max-w-lg mx-auto w-full select-none pb-12">
      {/* ── HESAP ── */}
      {authEnabled && (
        <div className="mb-5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-2 block">
            {langDict.set_lbl_account || 'Hesap'}
          </span>
          <div className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-2xl overflow-hidden shadow-sm">
            {userEmail ? (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20">
                    <UserRound className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-[#0a2540] dark:text-[#e0f4ff] block truncate">{userEmail}</span>
                    <span className={`text-[11px] flex items-center gap-1 mt-0.5 ${syncStatus === 'error' ? 'text-rose-500' : 'text-[#4a7a96] dark:text-[#5fa8c8]'}`}>
                      <Cloud className="w-3 h-3" /> {syncText}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#dff0f7] dark:bg-[#0d2236] text-xs font-bold text-[#0a2540] dark:text-[#e0f4ff] hover:bg-sky-200 dark:hover:bg-[#0c2d44] transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {langDict.auth_signout || 'Çıkış yap'}
                </button>
                <p className="text-[11px] text-[#4a7a96] dark:text-[#5fa8c8] leading-relaxed">
                  {langDict.auth_signout_note || 'Çıkış yapınca bu cihazdaki veriler silinir; hesabına giriş yaptığında geri gelir.'}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-sky-50/60 dark:hover:bg-sky-950/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20">
                  <LogIn className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#0a2540] dark:text-[#e0f4ff] block">{langDict.auth_cta || 'Giriş yap / Hesap oluştur'}</span>
                  <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8] mt-0.5 leading-relaxed">
                    {langDict.auth_cta_desc || 'Beğenilerini yedekle, telefon ve bilgisayarında aynı veriyle devam et.'}
                  </p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── OKUMA DENEYİMİ (Reading Experience) ── */}
      <div className="mb-5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-2 block">
          {langDict.set_lbl_experience || "Okuma Deneyimi"}
        </span>
        <div className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-2xl overflow-hidden shadow-sm divide-y divide-[#c5dfe9] dark:divide-[#0d2f45]">
          {/* AKIŞ MODU SWITCH */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-600/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#0a2540] dark:text-[#e0f4ff] block">
                  {langDict.set_reels_mode || "Akış Modu"}
                </span>
                <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8] mt-0.5 leading-relaxed">
                  {langDict.set_reels_desc || "Makaleleri dikey kaydırarak geçin, beğenmek için sağa, ayrıntılar için sola kaydırın."}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.reelsMode}
                onChange={(e) => onUpdateSettings(prev => ({ ...prev, reelsMode: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#c5dfe9] dark:bg-[#0d2f45] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0369a1]"></div>
            </label>
          </div>

          {/* BLUP TRANSLATION (Fish Button) */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#0a2540] dark:text-[#e0f4ff]">
                {langDict.set_fish_tr || "blup"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings(prev => ({ ...prev, translate: !prev.translate }))}
              title="blup"
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${
                settings.translate
                  ? 'bg-[#dbeafe] dark:bg-[#0c2d44] border-sky-500 text-sky-600 dark:text-cyan-400 scale-105 shadow-sm'
                  : 'bg-[#dff0f7] dark:bg-[#0d2236] border-[#c5dfe9] dark:border-[#0d2f45] text-[#4a7a96] dark:text-[#5fa8c8]'
              }`}
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C7 4 2.7 7.5 1 12c1.7 4.5 6 8 11 8 2.2 0 4.2-.7 6-1.8l3 1.8-1.5-3.5C20.5 15 21 13.5 21 12c0-4.4-4-8-9-8zm-4 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
              </svg>
            </button>
          </div>

          {/* SOUND EFFECTS */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm font-semibold text-[#0a2540] dark:text-[#e0f4ff]">
              {langDict.set_sound || "Ses efektleri"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings.sound}
                onChange={(e) => onUpdateSettings(prev => ({ ...prev, sound: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#c5dfe9] dark:bg-[#0d2f45] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0369a1]"></div>
            </label>
          </div>
        </div>
      </div>

      {/* ── UYGULAMA DİLİ (Language) ── */}
      <div className="mb-5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-2 block">
          {langDict.set_lbl_lang || "Uygulama Dili"}
        </span>
        <div className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-2xl p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#dff0f7] dark:bg-[#0d2236] rounded-xl">
            <button
              type="button"
              onClick={() => onUpdateSettings(prev => ({ ...prev, lang: 'tr' }))}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                settings.lang === 'tr'
                  ? 'bg-white dark:bg-[#071828] text-[#0369a1] dark:text-[#38bdf8] shadow-sm'
                  : 'text-[#4a7a96] dark:text-[#5fa8c8]'
              }`}
            >
              Türkçe
            </button>
            <button
              type="button"
              onClick={() => onUpdateSettings(prev => ({ ...prev, lang: 'en' }))}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                settings.lang === 'en'
                  ? 'bg-white dark:bg-[#071828] text-[#0369a1] dark:text-[#38bdf8] shadow-sm'
                  : 'text-[#4a7a96] dark:text-[#5fa8c8]'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* ── TEMA (Theme) ── */}
      <div className="mb-5">
        <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-2 block">
          {langDict.set_lbl_theme || "Tema"}
        </span>
        <div className="bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-2xl p-2 shadow-sm">
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#dff0f7] dark:bg-[#0d2236] rounded-xl">
            {(['auto', 'light', 'dark'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => onUpdateSettings(prev => ({ ...prev, theme: mode }))}
                className={`py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                  settings.theme === mode
                    ? 'bg-white dark:bg-[#071828] text-[#0369a1] dark:text-[#38bdf8] shadow-sm'
                    : 'text-[#4a7a96] dark:text-[#5fa8c8]'
                }`}
              >
                {mode === 'auto' ? langDict.theme_auto || 'Sistem' : mode === 'light' ? langDict.theme_light || 'Açık Deniz' : langDict.theme_dark || 'Derin Deniz'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── UYGULAMA TURU ── */}
      {onReplayTour && (
        <div className="mb-5">
          <button
            type="button"
            onClick={onReplayTour}
            className="w-full text-left bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-2xl p-4 shadow-sm hover:border-sky-500 transition-colors"
          >
            <b className="block text-xs sm:text-sm text-[#0a2540] dark:text-[#e0f4ff]">{langDict.tour_replay || "Uygulama turunu tekrar göster"}</b>
            <span className="text-[11px] text-[#4a7a96] dark:text-[#5fa8c8]">{langDict.tour_replay_desc}</span>
          </button>
        </div>
      )}

      {/* ── İŞLEMLER (Danger Zone) ── */}
      <div className="mb-4">
        <span className="text-[11px] font-bold tracking-wider uppercase text-rose-500 mb-2 block">
          {langDict.set_lbl_actions || "İşlemler"}
        </span>
        <div className="bg-white dark:bg-[#071828] border border-rose-200 dark:border-rose-950 rounded-2xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={onClearLikes}
            className="w-full p-4 flex items-center justify-between text-left text-rose-600 dark:text-rose-400 font-semibold text-xs sm:text-sm hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Trash2 className="w-4 h-4" />
              <span>{langDict.clear_likes || "Tüm beğenilenleri temizle"}</span>
            </div>
            <span className="text-xs opacity-60">▤</span>
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-[#4a7a96] dark:text-[#5fa8c8] px-2">
        {userEmail
          ? (langDict.privacy_note_account || "Veriler hesabına bağlı olarak güvenle saklanır; yalnızca sen erişebilirsin.")
          : (langDict.privacy_note || "Veriler yalnızca bu cihazın tarayıcısında saklanır.")}
      </p>

      {/* Sitenin En Altındaki Telif & İmza Yazısı */}
      <footer className="mt-4 pt-4 pb-2 text-center border-t border-[#c5dfe9]/50 dark:border-[#0d2f45]/50">
        <p className="text-xs text-[#527993] dark:text-[#7bb0cc] font-medium tracking-wide">
          © 2026 Binali. Her hakkı saklıdır.
        </p>
      </footer>
    </div>
  );
};
