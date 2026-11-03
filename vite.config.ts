import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';
import vitePrerender from 'vite-plugin-prerender';

export default defineConfig(({command}) => {
  const rootDir = path.dirname(fileURLToPath(import.meta.url));
  // SEO: yalnızca `vite build` sırasında, ana sayfa statik HTML'e dönüştürülür.
  // Netlify'da Chromium sorun çıkarırsa Build env'e SKIP_PRERENDER=true ekleyerek kapatabilirsiniz.
  const prerenderPlugins =
    command === 'build' && process.env.SKIP_PRERENDER !== 'true'
      ? [
          vitePrerender({
            staticDir: path.join(rootDir, 'dist'),
            // Uygulama tek sayfalı (router yok); indekslenecek tek gerçek URL ana sayfadır.
            routes: ['/'],
            renderer: new vitePrerender.PuppeteerRenderer({
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox'],
              // Açılış animasyonu ve ilk render için bekleme süresi (ms).
              renderAfterTime: 4000,
            }),
          }),
        ]
      : [];
  return {
    // Göreli yol: Netlify (kök) ve GitHub Pages (/abstrack/ alt dizini) için aynı derleme çalışır.
    base: './',
    build: {
      // three.js ayrı (tembel) parçada; kalan ana paket için uyarı eşiği.
      chunkSizeWarningLimit: 900,
    },
    plugins: [react(), tailwindcss(), ...prerenderPlugins],
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
