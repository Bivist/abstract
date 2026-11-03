import { Paper } from '../types';
import { WORK_ID_RE, shortWorkId } from './openalex';

/** Paylaşım bağlantılarında kullanılan sorgu parametresi: ?makale=W123456789 */
export const SHARE_PARAM = 'makale';

/** Uygulamanın kök adresi (alt dizinde yayınlansa bile doğru çalışır). */
function appBaseUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

export function buildShareUrl(paper: Pick<Paper, 'id'>): string {
  const id = shortWorkId(paper.id);
  return WORK_ID_RE.test(id) ? `${appBaseUrl()}?${SHARE_PARAM}=${id}` : appBaseUrl();
}

/** Açılışta adres çubuğundaki paylaşılan makale kimliğini okur (geçersizse null). */
export function readSharedIdFromLocation(): string | null {
  try {
    const raw = new URLSearchParams(window.location.search).get(SHARE_PARAM);
    if (!raw) return null;
    const id = raw.trim().toUpperCase();
    return WORK_ID_RE.test(id) ? id : null;
  } catch {
    return null;
  }
}

/** Makale açıldıktan sonra parametreyi adresten kaldırır; yenileyince aynı makale tekrar açılmasın. */
export function clearSharedParam(): void {
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(SHARE_PARAM)) return;
    url.searchParams.delete(SHARE_PARAM);
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  } catch {
    /* sessizce geç */
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* eski yönteme düş */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

/**
 * Telefonda sistemin paylaşım menüsünü açar (WhatsApp, Mesajlar vb.).
 * Desteklenmiyorsa bağlantıyı panoya kopyalar.
 */
export async function sharePaper(paper: Paper, title?: string): Promise<ShareResult> {
  const url = buildShareUrl(paper);
  const shownTitle = (title || paper.title || 'Makale').trim();

  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: shownTitle,
        text: `${shownTitle} — Abstract'ta oku`,
        url
      });
      return 'shared';
    } catch (err: any) {
      if (err && err.name === 'AbortError') return 'cancelled';
      /* başka bir hata: kopyalamayı dene */
    }
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}
