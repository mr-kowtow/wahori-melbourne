# Engineering Review & Improvement Suggestions

All suggestions below are compatible with **GitHub Pages** (static hosting, no server-side runtime).

---

## Current state summary

The site is a single `index.html` (~65 KB) containing all markup, styles, and JavaScript. This is intentional for simplicity and works well at this scale. The issues below are real but proportional — fix the high-priority ones first.

---

## Priority 1 — Fix now (bugs / user-facing issues)

### 1.1 Language preference is not persisted

When a visitor switches to English and refreshes, they're back to Japanese. One line fixes this.

```js
// In setLang(), add:
localStorage.setItem('lang', lang);

// At script startup, add:
const savedLang = localStorage.getItem('lang');
if (savedLang) setLang(savedLang);
```

### 1.2 `innerHTML` swap breaks nested `data-jp` elements

`setLang` does `querySelectorAll('[data-jp]').forEach(el => el.innerHTML = ...)`. If a parent element has `data-jp` and also contains children with `data-jp`, setting the parent's `innerHTML` detaches the children from the DOM — their updates in the same loop are then lost.

Current workaround is that the content strings in `data-jp` embed child HTML as a raw string (e.g. `<span class='text-line'>...</span>`). This works but is fragile and means child elements lose their DOM identity on every language switch.

**Fix:** Walk only leaf nodes, or restructure so parent containers don't carry `data-jp` attributes — only their text-containing children do.

### 1.3 No `<meta>` OG/social tags

When someone shares the URL on LINE, Twitter, or iMessage, no preview image, title, or description appears.

Add to `<head>`:

```html
<meta property="og:title" content="Wahori Melbourne | ワーホリメルボルン安心住宅">
<meta property="og:description" content="Safe, verified housing in Melbourne for Japanese working holiday makers — with full Japanese support.">
<meta property="og:image" content="https://wahori-melbourne.com/og-image.jpg">
<meta property="og:url" content="https://wahori-melbourne.com">
<meta name="twitter:card" content="summary_large_image">
```

### 1.4 No favicon

The browser tab shows a blank icon. Add a favicon — even a simple emoji-based one:

```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>">
```

---

## Priority 2 — Should do (maintainability & performance)

### 2.1 Replace Tailwind CDN with a build step

The CDN loads the entire Tailwind CSS library (~350 KB unminified). A proper build would strip unused classes down to ~10–15 KB. This is the single biggest performance gain available.

**How to do this with GitHub Pages:**

1. Add a `package.json` with `tailwindcss` and a build script
2. Add a `tailwind.config.js` pointing at `index.html`
3. Add a GitHub Actions workflow that runs `npx tailwindcss build` and deploys the output

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build        # generates dist/index.html with compiled CSS
      - uses: actions/deploy-pages@v4
        with: { folder: dist }
```

Until you add a build step, the CDN is fine — just know it's a trade-off.

### 2.2 Move content to JSON data files

All bilingual copy is hardcoded into HTML attributes. This makes it hard to:
- Update copy without touching HTML structure
- Hand off to a translator
- Add a third language

**Simple approach (no build tool needed):** Extract content to a `content.json` file, load it via `fetch`, and render it into the page on load. Still 100% static, still works on GitHub Pages.

```json
{
  "hero": {
    "jp": { "headline": "メルボルンで安心・安全な住まいを見つけよう" },
    "en": { "headline": "Find Your Safe, Verified Home in Melbourne" }
  }
}
```

### 2.3 Self-host or subset the Japanese font

Noto Sans JP loaded from Google Fonts adds a blocking network request and ~300 KB for the 5 weights currently used. Options (all GitHub Pages compatible):

- **Font subsetting:** Use `pyftsubset` or [Font Squirrel](https://www.fontsquirrel.com/tools/webfont-generator) to strip glyphs not used on the site. Expect 60–80% size reduction.
- **Reduce weights:** The site uses weights 300, 400, 500, 700, 900. Dropping 300 and 500 saves one network round-trip with minimal visual impact.
- **Add `font-display: swap`** (already partially covered by Google's URL params — just verify it's there):
  ```
  &display=swap
  ```

### 2.4 Add `lang` attribute logic for SEO

The page starts as `<html lang="ja">` which is correct for JP default. JavaScript updates it on language switch. But search engines crawl without JS, so they always see the Japanese version — which is fine if the target audience is Japanese. Just make sure this is intentional and the JP copy is complete and accurate.

If you want Google to index both languages, the proper solution is two separate HTML files (`index.html` for JP, `en/index.html` for English) with `<link rel="alternate" hreflang="...">` tags.

---

## Priority 3 — Nice to have (growth features)

### 3.1 Contact form as a fallback (Formspree)

The site's only CTA is LINE. Some visitors (especially non-Japanese) may not have LINE. [Formspree](https://formspree.io) provides a static-compatible form backend — free tier is generous.

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
  <input type="email" name="email" placeholder="Email">
  <textarea name="message"></textarea>
  <button type="submit">Send</button>
</form>
```

### 3.2 Add a GitHub Actions deploy workflow

Right now, GitHub Pages deploys automatically when you push to `main` (branch-root mode). But you have no visibility into deploy status, no build step, and no way to run checks before deploy.

Adding a workflow (even a trivial one) gives you:
- Deploy status badges
- A place to add HTML validation (`html-validate`)
- A hook for future build steps (Tailwind, image compression)

### 3.3 Animate the language switch more smoothly

Currently, `el.innerHTML = ...` is instantaneous. A simple cross-fade would feel more polished:

```js
// Wrap content in a fade-out/fade-in
document.body.style.opacity = '0.6';
document.body.style.transition = 'opacity 0.15s';
setTimeout(() => {
  // ... do the swap ...
  document.body.style.opacity = '1';
}, 150);
```

### 3.4 Image assets

The site has no real images — areas, property photos, team photos. Hosting images in a `/images` folder in the repo works fine on GitHub Pages (just mind the 1 GB repo size limit). For production, consider a CDN like Cloudflare Images or Bunny.net for WebP/AVIF optimisation.

### 3.5 Structured data (JSON-LD)

Adding `LocalBusiness` structured data helps Google show rich results:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Wahori Melbourne",
  "description": "Safe housing for Japanese working holiday makers in Melbourne",
  "url": "https://wahori-melbourne.com",
  "areaServed": "Melbourne, VIC, Australia",
  "availableLanguage": ["Japanese", "English"]
}
</script>
```

---

## What NOT to change (things that are already right)

- **Single HTML file** — At this scale (one page, one person editing), splitting into components adds complexity for no benefit. Only introduce a build tool when the pain of the current approach is real.
- **Vanilla JS** — No framework needed. The existing JS is ~80 lines and handles everything. Adding React/Vue for a marketing one-pager would be over-engineering.
- **Docker for local dev** — The nginx Dockerfile is the right choice. It mirrors the static-file behaviour of GitHub Pages closely enough to catch layout issues before deploying.
- **GitHub Pages** — Free, reliable, zero-ops. The right call for a static marketing site at this stage.
