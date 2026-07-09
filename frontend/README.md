# ShopVerse AI — Frontend

Static site — no build step required. Pure HTML/CSS/JS.

```
frontend/
  index.html         entry point
  config.js          <-- edit this after deploying the backend (API_BASE_URL)
  assets/
    css/style.css
    js/app.js         all application logic, calls the backend REST API
    images/           (empty — add product/brand imagery here if needed)
  robots.txt
  sitemap.xml
```

## Deploy

Any static host works (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, or a
plain nginx server). Steps:

1. Deploy `backend/` first (see `../backend/README.md`) and note its public URL.
2. Edit `config.js`:
   ```js
   window.SHOPVERSE_CONFIG = {
     API_BASE_URL: "https://your-backend-domain.com/api/v1",
   };
   ```
3. Deploy this `frontend/` folder as-is — e.g. `vercel deploy` or drag-and-drop
   onto Netlify. No build command needed; the publish directory is this folder.
4. Update the `https://shopverse.ai/` placeholders in `index.html` (canonical
   URL, Open Graph/Twitter tags, JSON-LD) and in `robots.txt` / `sitemap.xml`
   to your real domain.

## What's wired to the backend

Every page calls the real API in `assets/js/app.js` — search, product detail,
price history, reviews, recommendations, AI assistant, auth, wishlist, price
alerts, notifications, coupons. There is no mock data left in this file; if
the backend is unreachable, each section shows an explicit error/empty state
rather than fake data.

## SEO note

This is a client-rendered single-page app — search engines and social-link
previews primarily see the static `<head>` tags (already filled in), not the
JS-rendered product content. For per-product indexable pages, add a
server-side rendering layer (e.g. Next.js) in front of this same backend API
— no backend changes needed for that.
