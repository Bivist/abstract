import { supabase } from '../lib/supabase';

/** Giriş sonrası / e-posta bağlantısı sonrası dönülecek adres (alt dizinde de çalışır). */
function redirectUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

export interface AuthResult {
  ok: boolean;
  /** Kullanıcıya gösterilecek Türkçe mesaj (hata ya da bilgi). */
  message?: string;
  /** Doğrulama e-postası gönderildi (oturum henüz açılmadı). */
  needsConfirm?: boolean;
}

/** Supabase hata iletilerini anlaşılır Türkçeye çevirir. */
function friendly(err: { message?: string; status?: number; code?: string } | null | undefined): string {
  const msg = (err?.message || '').toLowerCase();
  const code = err?.code || '';
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) return 'E-posta veya şifre hatalı.';
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) return 'E-postan henüz doğrulanmamış. Gelen kutundaki bağlantıya tıkla.';
  if (code === 'user_already_exists' || msg.includes('already registered')) return 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.';
  if (code === 'weak_password' || msg.includes('password should be')) return 'Şifre en az 8 karakter olmalı.';
  if (code === 'same_password' || msg.includes('different from the old')) return 'Yeni şifre eskisinden farklı olmalı.';
  if (code === 'over_email_send_rate_limit' || msg.includes('rate limit') || err?.status === 429) return 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar dene.';
  if (msg.includes('failed to fetch') || msg.includes('network')) return 'Bağlantı hatası. İnternetini kontrol edip tekrar dene.';
  if (msg.includes('invalid email') || code === 'validation_failed') return 'Geçerli bir e-posta adresi gir.';
  return 'Bir sorun oluştu. Lütfen tekrar dene.';
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: 'Giriş şu an kullanılamıyor.' };
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl() }
  });
  // Başarılıysa tarayıcı Google'a yönlendirilir; buraya genelde dönülmez.
  return error ? { ok: false, message: friendly(error) } : { ok: true };
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: 'Giriş şu an kullanılamıyor.' };
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  return error ? { ok: false, message: friendly(error) } : { ok: true };
}

export async function signUpWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: 'Giriş şu an kullanılamıyor.' };
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { emailRedirectTo: redirectUrl() }
  });
  if (error) return { ok: false, message: friendly(error) };
  // E-posta zaten kayıtlıysa Supabase (hesap sızdırmamak için) hata yerine boş identities döner.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ok: false, message: 'Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.' };
  }
  if (!data.session) {
    return { ok: true, needsConfirm: true, message: 'Doğrulama bağlantısını e-postana gönderdik. Bağlantıya tıkladıktan sonra giriş yapabilirsin.' };
  }
  return { ok: true };
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: 'Giriş şu an kullanılamıyor.' };
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: redirectUrl() });
  if (error) return { ok: false, message: friendly(error) };
  return { ok: true, message: 'Bu e-posta kayıtlıysa şifre yenileme bağlantısı gönderildi.' };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!supabase) return { ok: false, message: 'Giriş şu an kullanılamıyor.' };
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { ok: false, message: friendly(error) } : { ok: true, message: 'Şifren güncellendi.' };
}

export async function signOutUser(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut({ scope: 'local' }); // yalnızca bu cihaz; diğer cihazlar açık kalır
}
