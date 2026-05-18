# Deployment & Performance Guide — TAMIS АГРО

This document captures the production-build, compression and Lighthouse-CI
setup added during the optimisation pass. It is the **canonical reference**
for anyone deploying or monitoring the frontend.

---

## 1. Production build

```bash
cd frontend
yarn install --frozen-lockfile
CI=false GENERATE_SOURCEMAP=false yarn build
```

Outputs to `frontend/build/`. Every JS/CSS/HTML/SVG/JSON asset is
**pre-compressed with both Brotli (.br) and gzip (.gz)** alongside the
original file by the `compression-webpack-plugin` configured in
`craco.config.js`.

### Build-size benchmarks (last measured)

| Bundle | Raw      | gzip      | Brotli    |
|--------|---------:|----------:|----------:|
| JS     | 864 KB   | 233 KB    | **202 KB** |
| CSS    | 388 KB   |  82 KB    | **72 KB**  |
| **JS+CSS total** | **1252 KB** | **315 KB (-75%)** | **274 KB (-78%)** |

Top chunk: `main.js` 357 KB → Brotli **96 KB**.

### Bundle analyzer (opt-in)

```bash
ANALYZE=true yarn build
# opens frontend/build/bundle-report.html — interactive treemap
```

---

## 2. Brotli / gzip on the CDN / reverse-proxy

The build emits `<asset>.br` and `<asset>.gz` next to every file.
Your edge layer must **serve the pre-compressed variant** instead of
compressing on every request.

### Nginx (server block)

```nginx
# /etc/nginx/sites-enabled/tamis-agro.conf
server {
  listen 443 ssl http2;
  server_name tamis-agro.ua;

  root /var/www/tamis/frontend/build;
  index index.html;

  # Static pre-compression: serve .br / .gz if client supports it
  gzip_static on;            # built into nginx core
  brotli_static on;          # requires ngx_brotli module
  brotli_types  text/plain text/css application/json application/javascript
                application/xml+rss application/atom+xml image/svg+xml;

  # SPA history fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Long-cache fingerprinted assets, short-cache HTML
  location /static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location = /index.html {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # SEO files
  location = /robots.txt { try_files $uri =404; expires 1d; }
  location = /sitemap.xml { try_files $uri =404; expires 1d; }
}
```

### Cloudflare

1. **Speed → Brotli** → set to **On**.
2. **Caching → Configuration → Browser TTL** → `1 year` for `/static/*`.
3. **Rules → Page Rules**:
   - `*.tamis-agro.ua/static/*` → `Cache Level: Cache Everything`,
     `Edge Cache TTL: 1 month`.
   - `tamis-agro.ua/index.html` → `Cache Level: Bypass`.
4. Brotli/gzip are negotiated automatically per `Accept-Encoding`.

### Apache (`.htaccess`)

```apache
<IfModule mod_headers.c>
  RewriteEngine On
  # Serve .br when supported
  RewriteCond %{HTTP:Accept-Encoding} br
  RewriteCond %{REQUEST_FILENAME}.br -f
  RewriteRule ^(.*)$ $1.br [L]
  # Fallback to .gz
  RewriteCond %{HTTP:Accept-Encoding} gzip
  RewriteCond %{REQUEST_FILENAME}.gz -f
  RewriteRule ^(.*)$ $1.gz [L]

  <FilesMatch "\.js\.br$">
    AddType application/javascript .br
    Header set Content-Encoding br
  </FilesMatch>
  <FilesMatch "\.css\.br$">
    AddType text/css .br
    Header set Content-Encoding br
  </FilesMatch>
  <FilesMatch "\.js\.gz$">
    AddType application/javascript .gz
    Header set Content-Encoding gzip
  </FilesMatch>
  <FilesMatch "\.css\.gz$">
    AddType text/css .gz
    Header set Content-Encoding gzip
  </FilesMatch>
</IfModule>
```

### Kubernetes Ingress (nginx-ingress)

```yaml
metadata:
  annotations:
    nginx.ingress.kubernetes.io/enable-brotli: "true"
    nginx.ingress.kubernetes.io/brotli-level: "6"
    nginx.ingress.kubernetes.io/use-gzip: "true"
```

> ⚠️ Note: the **dev preview** environment served by `craco start` is the
> HMR dev server (no Brotli/gzip). Brotli benefits only apply to the
> production `build/` output behind your real reverse-proxy.

---

## 3. Lighthouse CI

### Local run

```bash
cd frontend
yarn build
yarn lighthouse
# Reports → frontend/lighthouse-reports/
```

### Performance budgets (configured in `lighthouserc.js`)

| Category | Min score | Severity |
|---|---:|---|
| Performance | 0.85 | **fail PR** |
| Accessibility | 0.90 | **fail PR** |
| SEO | 0.95 | **fail PR** |
| Best Practices | 0.90 | warn |

Specific timing budgets:

* FCP ≤ 2.0s · LCP ≤ 2.5s · CLS ≤ 0.1 — **fail**
* TBT ≤ 300ms · Speed Index ≤ 3.0s — warn
* `total-byte-weight` ≤ 2.5 MB — warn
* `modern-image-formats` — required (we serve WebP)
* `uses-text-compression` — required (Brotli/gzip)

### GitHub Actions

`.github/workflows/lighthouse.yml` runs on **every push and PR to
`main` / `develop`**:

1. Installs deps with `yarn install --frozen-lockfile`.
2. Builds the production bundle (`yarn build`).
3. Runs `@lhci/cli autorun` against 5 routes (home, catalog, about,
   cultures, contacts).
4. Uploads HTML reports as an artifact (`lighthouse-reports-<run>`).
5. On a PR, posts a comment with the four category scores.

If any **fail** budget is missed the workflow exits with status 1
and blocks the merge.

---

## 4. Asset summary after the optimisation pass

| Asset class | Before | After | Δ |
|---|---:|---:|---:|
| PNG | 159 MB (147 files) | 3.3 MB (55 files) | **−98 %** |
| WebP | 0 | 19 MB (92 files) | new |
| JPG | 1.8 MB (23 files) | 1.7 MB | −5 % |
| SVG | 4.6 MB (57 files) | 436 KB | **−91 %** |
| GIF/animation | 21 MB | 0 (replaced by MP4/WebM) | −100 % |
| Video (MP4/WebM) | 2.2 MB | 4.5 MB (3 files) | + (replaces 21 MB GIF) |
| **Total `public/`** | **190 MB** | **29 MB** | **−85 %** |

Plus on-the-wire savings: **Brotli reduces JS+CSS by another 78 %**
(1252 KB → 274 KB).

---

## 5. Checklist before going live

- [ ] Run `yarn build` and deploy the contents of `build/`.
- [ ] Enable `brotli_static on; gzip_static on;` (or equivalent on your CDN).
- [ ] Verify with `curl -H "Accept-Encoding: br" -I https://your-domain/static/js/main.<hash>.js`
      — response must have `content-encoding: br`.
- [ ] Confirm `robots.txt` and `sitemap.xml` return 200.
- [ ] Submit `sitemap.xml` to Google Search Console.
- [ ] Set up Lighthouse CI on your CI runner (see workflow above).
