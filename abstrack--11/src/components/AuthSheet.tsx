import React, { useEffect, useState } from 'react';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  sendPasswordReset,
  updatePassword,
  type AuthResult
} from '../utils/auth';

type Mode = 'signin' | 'signup' | 'forgot' | 'recovery';

interface AuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Şifre yenileme bağlantısıyla gelindiyse true: yeni şifre formu açılır. */
  recovery: boolean;
  onRecoveryDone: () => void;
  /** Açılış ekranı: "Misafir olarak devam et" düğmesini gösterir. */
  guestOption?: boolean;
  langDict: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.4-4.8 7.1l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.4z" />
    <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
  </svg>
);

export const AuthSheet: React.FC<AuthSheetProps> = ({ isOpen, onClose, recovery, onRecoveryDone, guestOption = false, langDict }) => {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Her açılışta formu temizle; şifre yenileme bağlantısıyla gelindiyse o moda geç.
  useEffect(() => {
    if (!isOpen) return;
    setMode(recovery ? 'recovery' : 'signin');
    setPassword('');
    setError(null);
    setInfo(null);
  }, [isOpen, recovery]);

  if (!isOpen) return null;

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setInfo(null);
    setPassword('');
  };

  const finish = (res: AuthResult, closeOnOk = true) => {
    if (!res.ok) {
      setError(res.message || 'Bir sorun oluştu.');
      return;
    }
    if (res.message) setInfo(res.message);
    if (closeOnOk && !res.needsConfirm && !res.message) onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setInfo(null);

    if (mode !== 'recovery' && !EMAIL_RE.test(email.trim())) {
      setError('Geçerli bir e-posta adresi gir.');
      return;
    }
    if (mode !== 'forgot' && password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signin') {
        finish(await signInWithEmail(email, password));
      } else if (mode === 'signup') {
        finish(await signUpWithEmail(email, password));
      } else if (mode === 'forgot') {
        finish(await sendPasswordReset(email), false);
      } else {
        const res = await updatePassword(password);
        if (res.ok) {
          onRecoveryDone();
          onClose();
        } else {
          setError(res.message || 'Bir sorun oluştu.');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await signInWithGoogle();
    if (!res.ok) {
      setError(res.message || 'Google ile giriş başlatılamadı.');
      setBusy(false);
    }
    // Başarılıysa sayfa Google'a yönlenir; busy açık kalması sorun değil.
  };

  const title =
    mode === 'signin' ? (langDict.auth_signin || 'Giriş yap')
    : mode === 'signup' ? (langDict.auth_signup || 'Hesap oluştur')
    : mode === 'forgot' ? (langDict.auth_forgot_title || 'Şifreni yenile')
    : (langDict.auth_new_password || 'Yeni şifre belirle');

  const inputCls =
    'w-full pl-10 pr-3.5 py-3 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-sm text-[#0a2540] dark:text-[#e0f4ff] select-text focus:outline-none focus:border-sky-600';

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-lg max-h-[92dvh] bg-[#eef7fb] dark:bg-[#020f1a] rounded-t-3xl border-t border-[#c5dfe9] dark:border-[#0d2f45] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="w-10 h-1 bg-[#c5dfe9] dark:bg-[#0d2f45] rounded-full mx-auto my-2.5 shrink-0" />

        <div className="flex items-center justify-between px-5 py-2 border-b border-[#c5dfe9] dark:border-[#0d2f45] shrink-0">
          <h3 className="font-serif text-lg font-bold text-[#0a2540] dark:text-[#e0f4ff]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="w-8 h-8 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] flex items-center justify-center hover:bg-sky-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar">
          {mode !== 'recovery' && mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={google}
                disabled={busy}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] text-sm font-semibold text-[#0a2540] dark:text-[#e0f4ff] hover:border-sky-500 transition-colors disabled:opacity-50"
              >
                <GoogleLogo />
                {langDict.auth_google || 'Google ile devam et'}
              </button>
              <div className="flex items-center gap-3 text-[11px] text-[#4a7a96] dark:text-[#5fa8c8]">
                <span className="flex-1 h-px bg-[#c5dfe9] dark:bg-[#0d2f45]" />
                {langDict.auth_or || 'veya e-posta ile'}
                <span className="flex-1 h-px bg-[#c5dfe9] dark:bg-[#0d2f45]" />
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8] leading-relaxed">
              {langDict.auth_forgot_desc || 'E-posta adresini yaz, sana şifreni yenilemen için bir bağlantı gönderelim.'}
            </p>
          )}
          {mode === 'recovery' && (
            <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8] leading-relaxed">
              {langDict.auth_recovery_desc || 'Hesabın için yeni bir şifre belirle (en az 8 karakter).'}
            </p>
          )}

          <form onSubmit={submit} className="space-y-3" noValidate>
            {mode !== 'recovery' && (
              <label className="relative block">
                <span className="sr-only">E-posta</span>
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a7a96] dark:text-[#5fa8c8]" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={langDict.auth_email || 'E-posta'}
                  className={inputCls}
                />
              </label>
            )}
            {mode !== 'forgot' && (
              <label className="relative block">
                <span className="sr-only">Şifre</span>
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a7a96] dark:text-[#5fa8c8]" />
                <input
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signin' ? (langDict.auth_password || 'Şifre') : (langDict.auth_password_new || 'Şifre (en az 8 karakter)')}
                  className={inputCls}
                />
              </label>
            )}

            {error && (
              <p role="alert" className="text-xs text-rose-600 dark:text-rose-400 leading-relaxed">{error}</p>
            )}
            {info && (
              <p role="status" className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">{info}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-700 to-cyan-600 text-white rounded-xl text-sm font-bold shadow-md disabled:opacity-50"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? (langDict.auth_signin || 'Giriş yap')
                : mode === 'signup' ? (langDict.auth_signup || 'Hesap oluştur')
                : mode === 'forgot' ? (langDict.auth_send_link || 'Bağlantı gönder')
                : (langDict.auth_save_password || 'Şifreyi kaydet')}
            </button>
          </form>

          <div className="text-center text-xs text-[#4a7a96] dark:text-[#5fa8c8] space-y-2 pt-1">
            {mode === 'signin' && (
              <>
                <button type="button" onClick={() => switchMode('forgot')} className="underline underline-offset-2 hover:text-sky-600">
                  {langDict.auth_forgot || 'Şifremi unuttum'}
                </button>
                <p>
                  {langDict.auth_no_account || 'Hesabın yok mu?'}{' '}
                  <button type="button" onClick={() => switchMode('signup')} className="font-bold text-[#0369a1] dark:text-[#38bdf8]">
                    {langDict.auth_signup || 'Hesap oluştur'}
                  </button>
                </p>
              </>
            )}
            {mode === 'signup' && (
              <p>
                {langDict.auth_have_account || 'Zaten hesabın var mı?'}{' '}
                <button type="button" onClick={() => switchMode('signin')} className="font-bold text-[#0369a1] dark:text-[#38bdf8]">
                  {langDict.auth_signin || 'Giriş yap'}
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <button type="button" onClick={() => switchMode('signin')} className="font-bold text-[#0369a1] dark:text-[#38bdf8]">
                {langDict.auth_back || 'Girişe dön'}
              </button>
            )}
          </div>

          {guestOption && mode !== 'recovery' && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-[#c5dfe9] dark:border-[#0d2f45] text-sm font-semibold text-[#0a2540] dark:text-[#e0f4ff] hover:border-sky-500 transition-colors"
              >
                {langDict.auth_guest || 'Misafir olarak devam et'}
              </button>
              <p className="text-[11px] text-center text-[#4a7a96] dark:text-[#5fa8c8] leading-relaxed mt-2">
                {langDict.auth_guest_note || 'Hesap olmadan da tüm özellikleri kullanabilirsin; veriler yalnızca bu cihazda kalır. İstediğin zaman Ayarlar\'dan giriş yapabilirsin.'}
              </p>
            </div>
          )}

          <p className="text-[11px] text-center text-[#4a7a96] dark:text-[#5fa8c8] leading-relaxed">
            {langDict.auth_privacy || 'Hesap isteğe bağlıdır. Giriş yaparsan beğenilerin, klasörlerin ve ayarların hesabına yedeklenir ve cihazlar arasında eşitlenir.'}
          </p>
        </div>
      </div>
    </div>
  );
};
