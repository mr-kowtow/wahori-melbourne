# Wahori Melbourne

A bilingual (Japanese/English) landing page for **Wahori Melbourne** — a verified housing service for Japanese working holiday visa makers relocating to Melbourne, Australia.

Live site: [wahori-melbourne.com](https://wahori-melbourne.com)

---

## What this is

A single-page marketing site that:

- Presents the service in Japanese (default) and English
- Lets visitors toggle the language via a nav pill button (🇯🇵 JP / 🇦🇺 EN)
- Drives enquiries to a LINE account for consultation
- Covers: problem framing, solution, features, Melbourne area guide, pricing, add-ons, how-it-works, testimonials, and CTA

---

## Tech stack

| Layer | Tool |
|---|---|
| Markup | Vanilla HTML5 |
| Styling | Tailwind CSS (CDN) |
| Fonts | Noto Sans JP via Google Fonts |
| Interactivity | Vanilla JavaScript (inline) |
| Hosting | GitHub Pages (custom domain via `CNAME`) |
| Local dev | Docker + nginx (`docker-compose.yml`) |

No build step, no npm, no framework — everything ships as a single `index.html`.

---

## Repository structure

```
melbourne-housing/
├── index.html          # The entire site (HTML + CSS + JS)
├── CNAME               # GitHub Pages custom domain (wahori-melbourne.com)
├── Dockerfile          # nginx:alpine — serves index.html on port 80
├── docker-compose.yml  # Maps container port 80 → localhost:8080
└── README.md
```

---

## Running locally

### Option A — Docker (recommended, mirrors production nginx)

```bash
docker compose up
```

Then open [http://localhost:8080](http://localhost:8080).

### Option B — Any static file server

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# VS Code
# Use the "Live Server" extension
```

> Note: opening `index.html` directly as a `file://` URL works for most features but Google Fonts may be blocked by browser security policy in some environments.

---

## Deployment

This site deploys automatically via **GitHub Pages**:

1. GitHub Pages is configured to serve from the `main` branch root
2. The `CNAME` file points GitHub Pages to `wahori-melbourne.com`
3. **Any merge (or direct push) to `main` triggers an automatic redeploy** — typically live within 1–2 minutes

No build step is needed since the site is a static HTML file.

To confirm Pages is enabled: **GitHub repo → Settings → Pages**.

---

## Making content changes

All content lives in `index.html`. The bilingual system works via `data-jp` and `data-en` attributes:

```html
<h2 data-jp="日本語テキスト" data-en="English text">日本語テキスト</h2>
```

The inner HTML is the **Japanese default** shown on page load. When the visitor switches to English, JavaScript swaps `innerHTML` with the `data-en` value. Always keep both attributes and the inner HTML in sync.

---

## Improvement suggestions

See [**IMPROVEMENTS.md**](./IMPROVEMENTS.md) for a full engineering review and roadmap.
