import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import { createApi } from './server/api.js';

const criticalHomeCss = `
:root{--ink:#000;--line:#dedede;--page:min(1240px,calc(100vw - 64px));--header:82px;--display:'Museo Slab Thin',Rockwell,'Courier New',serif;--sans:'Museo Slab Thin',Rockwell,'Courier New',serif}
*,*::before,*::after{box-sizing:border-box}
html,body,#root{min-height:100%;margin:0;background:#fff}
body{color:var(--ink);font-family:var(--sans);font-weight:100;-webkit-font-smoothing:antialiased}
button,a{-webkit-tap-highlight-color:transparent}a{color:inherit;text-decoration:none}img{display:block;max-width:100%}
.site-page{overflow:clip;background:#fff}
.site-header{position:fixed;z-index:80;top:0;left:0;right:0;height:var(--header);background:rgba(255,255,255,.96);border-bottom:1px solid transparent}
.header-inner{width:var(--page);height:100%;margin:auto;display:grid;grid-template-columns:1fr auto 1fr;align-items:center}
.wordmark{display:flex;flex-direction:column;align-items:start;gap:8px;color:#000;font-size:20px;font-weight:700;line-height:0;letter-spacing:1px;text-transform:uppercase}
.site-nav{display:flex;align-items:center;gap:clamp(22px,3vw,44px)}.site-nav a{color:#000;font-size:11px;letter-spacing:.06em}
.header-actions{justify-self:end;display:flex;align-items:center;gap:17px;font-size:10px;letter-spacing:.08em}.header-social-links{display:flex;align-items:center;gap:11px}.header-social-links a{width:13px;height:13px;display:grid;place-items:center}.header-social-links svg{width:12px;height:12px;display:block}.menu-button{display:none}
.home-page,.home-page .home-main,.home-page .home-hero{width:100%;height:100vh;height:100svh;min-height:0}.home-page .home-main,.home-page .home-hero{margin:0;padding:0}.home-page .home-hero img{width:100%;height:100%;object-fit:cover}
.loading{min-height:240px;display:flex;align-items:center;justify-content:center;gap:12px;color:#000;font-size:11px;letter-spacing:.1em;text-transform:uppercase}.loading span{width:25px;height:1px;background:currentColor}
@media(max-width:980px){:root{--page:min(calc(100vw - 40px),760px);--header:82px}.site-nav{display:none}.menu-button{display:block;width:32px;height:32px;padding:6px;border:0;background:none}.menu-button span{display:block;height:1px;margin:6px 0;background:#000}.site-header{height:var(--header)}.header-inner{width:var(--page);min-width:0;grid-template-columns:minmax(0,1fr) auto}.header-actions{grid-column:2;gap:12px}.header-social-links{display:none}.wordmark{min-width:0;max-width:100%;overflow:hidden;font-size:16px;line-height:1;white-space:nowrap;text-overflow:ellipsis}.home-page .home-hero img{height:100%}}
@media(max-width:680px){.wordmark{max-width:calc(100vw - 145px)}}
`;

const asyncStylesheet = html => html.replace(
  /<link rel="stylesheet"([^>]*?)href="([^"]+)"([^>]*)\s*\/?>/,
  '<link rel="preload" as="style" href="$2"$1$3 onload="this.onload=null;this.rel=\'stylesheet\'" /><noscript><link rel="stylesheet" href="$2" /></noscript>'
);

export const injectCriticalStyles = html => {
  const critical = `<style data-critical-home>${criticalHomeCss}</style>`;
  const withCriticalFirst = html.replace('<link rel="stylesheet"', `${critical}<link rel="stylesheet"`);
  return asyncStylesheet(withCriticalFirst);
};

const localApi = () => ({
  name: 'andrea-alkalay-local-api',
  configureServer(server) {
    const { router } = createApi({ production: false });
    const api = express();
    api.use(router);
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith('/api/')) return next();
      api(req, res, next);
    });
  }
});

export default defineConfig({
  plugins: [react(), localApi(), {
    name: 'critical-home-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return injectCriticalStyles(html);
      }
    }
  }],
  publicDir: 'assets',
  server: {
    port: 4173,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store'
    }
  }
});
