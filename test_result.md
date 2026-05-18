#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================
# (Testing protocol preserved — see original repo for full text)
#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

user_problem_statement: |
  Continue and complete the blog feature for TAMIS АГРО.
  Requirements:
  - Full backend CRUD for blog posts, manageable from admin panel
  - Maximum-featured rich text editor (TipTap) with: bold, italic, links, images,
    videos, different fonts, indentation, lists, quotes, tables
  - Public article internal page matching site design — article body, related
    posts, reading time, category, tags, contact form at the bottom
  - Sorting/filtering by categories, tags, date
  - "Reading time" calculation
  - Inline contact form at the bottom of each article (matching site design)

backend:
  - task: "Blog public endpoints: list/detail/related/categories/tags"
    implemented: true
    working: "NA"
    file: "backend/blog_routes.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/blog/posts (filters category/tag/q/sort newest|oldest|popular, pagination), GET /api/blog/posts/{slug} (bumps view count, returns full HTML), GET /api/blog/posts/{slug}/related (3 same-category fallback latest), GET /api/blog/categories, GET /api/blog/tags. 8 seed posts inserted on first boot."

  - task: "Blog admin CRUD with JWT (role=admin) guard"
    implemented: true
    working: "NA"
    file: "backend/blog_routes.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "GET /api/admin/blog/posts (incl drafts), GET /api/admin/blog/posts/{id}, POST /api/admin/blog/posts, PATCH /api/admin/blog/posts/{id}, DELETE /api/admin/blog/posts/{id}. Slug uniqueness, reading-time calc, view count, published_at stamping."

  - task: "Image upload for editor"
    implemented: true
    working: "NA"
    file: "backend/blog_routes.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/admin/blog/upload-image (multipart). Limit 10MB. JPG/PNG/WEBP/GIF/SVG. Stored in /app/backend/uploads/blog and served at /api/uploads/blog/{filename} via StaticFiles. Returns {url, filename, size, content_type}."

  - task: "Inline contact form submission"
    implemented: true
    working: "NA"
    file: "backend/contact_messages_routes.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "POST /api/contact-messages — name/email/message/consent required. Re-used by blog post page inline contact form. Stores in contact_messages collection + optional telegram/email notification."

frontend:
  - task: "Public blog list page (/blog) with search, sort, category chips, reading-time on cards"
    implemented: true
    working: "NA"
    file: "frontend/src/pages/blog.tsx, frontend/src/components/blog/BlogCard.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Hero, breadcrumb, search box, sort select (newest/oldest/popular), category chips with counts, tag indicator, featured (regular + wide) + grid, empty/loading/error states. URL state for filters. Cards now show reading_minutes badge with clock icon."

  - task: "Public article page (/blog/:slug)"
    implemented: true
    working: "NA"
    file: "frontend/src/pages/blog-post.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Breadcrumb, meta row (category clickable → filter, date, reading-time, views), title, excerpt, cover, rendered HTML with full typography styles (h1-h3, p, ul/ol, blockquote, code, pre, table, hr, images, YouTube embed). Tags row (clickable). CTA block (email + callback modals). Related (3 posts same category). NEW: InlineContactForm at the bottom matching site design."

  - task: "RichEditor (TipTap) — maximum-featured WYSIWYG"
    implemented: true
    working: "NA"
    file: "frontend/src/components/blog/RichEditor.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Toolbar: undo/redo, headings (paragraph + H1-H3), font family selector (Golos Text default + Commissioner/Inter/Mono), B/I/U/Strike/Code, color picker + reset, lists (UL/OL), blockquote, codeblock, text align (4 modes), link, image upload (button + paste + drag&drop), YouTube embed, **TABLE insert + row/col operations**, horizontal rule, clear formatting. Live word + character count + reading-time at bottom. Editor view safely guarded against TipTap StrictMode race."

  - task: "Inline contact form on article page"
    implemented: true
    working: "NA"
    file: "frontend/src/components/blog/InlineContactForm.tsx, .module.css"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New component. Renders inside /blog/:slug after Related. Fields: name*, email*, phone, subject (prefilled with article title), message*, consent. Submits to /api/contact-messages. Success state with success-card. Validation: name length, email regex, message length, consent. Mobile responsive. Design matches site (green primary, lime accent)."

  - task: "Admin blog list (/admin/blog)"
    implemented: true
    working: "NA"
    file: "frontend/src/pages/admin/AdminBlog.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Tabs (All/Published/Drafts), local search by title/category/tag, table with cover thumb, status toggle button (click to publish/unpublish), HOT toggle, edit/delete actions, View on site (opens new tab). Stats row (total, published, drafts)."

  - task: "Admin blog editor (/admin/blog/new + /admin/blog/:id/edit)"
    implemented: true
    working: "NA"
    file: "frontend/src/pages/admin/AdminBlogEdit.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Two-column layout. Left: title, excerpt, RichEditor. Right (sidebar cards): Publication (status + HOT), Cover image (upload + URL + alt), Taxonomy (category with datalist + tags csv with chip preview), SEO (slug + seo_title + seo_description). Save as draft / Publish actions. Saved-at indicator."

  - task: "Navbar — 'Блог' link"
    implemented: true
    working: "NA"
    file: "frontend/src/components/figma/navbar1.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Added Блог link between 'Про нас' and 'Контакти' with active-state highlight, data-testid='navbar-blog-link'."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Blog public endpoints: list/detail/related/categories/tags"
    - "Blog admin CRUD with JWT (role=admin) guard"
    - "Image upload for editor"
    - "Inline contact form submission"
    - "Public blog list page (/blog) with search, sort, category chips, reading-time on cards"
    - "Public article page (/blog/:slug)"
    - "RichEditor (TipTap) — maximum-featured WYSIWYG"
    - "Inline contact form on article page"
    - "Admin blog list (/admin/blog)"
    - "Admin blog editor (/admin/blog/new + /admin/blog/:id/edit)"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Deployed the repo and continued the blog feature. Backend was already mostly built (CRUD + image upload + reading-time). I added:
        1) "Блог" link in the main navbar (between Про нас and Контакти)
        2) Reading-time badge with clock icon on blog cards (list view + related row)
        3) Enhanced RichEditor: FontFamily selector, CharacterCount live word/char/reading-time, TABLE insert + row/col ops, HR, image paste from clipboard + drag&drop upload. Fixed TipTap StrictMode race.
        4) New InlineContactForm component on the article page (after Related) — name/email/phone/subject/message/consent, posts to /api/contact-messages, success state.
      Admin credentials for testing: admin@tamis.ua / admin1234.  Test user: test@tamis.ua / test1234.
      Please test end-to-end (high priority first):
        - Admin login → /admin/blog → create a new post with cover upload, rich content (insert table, image via button, link, YouTube, font family change), publish → verify public list and detail pages render the content correctly, reading-time on card, related works, contact form submits.
        - Public blog list: filters (category chips, tag indicator from URL), search query, sort options, featured row vs filtered grid, empty state.
        - Public blog detail: breadcrumb, all meta rendered, tags clickable navigate to /blog?tag=…, CTA buttons open modals, inline contact form submits successfully and shows success card.
        - Backend: GET /api/blog/* endpoints, admin CRUD with bearer JWT, image upload PNG/JPG/WEBP, slug uniqueness, status toggle, view-counter bumps on detail GET.
        - Skip drag-and-drop and camera-only flows (LLM agent limitation).


  - agent: "main"
    message: |
      Phase: Products / Catalog backend + admin (2026-05-18).
      Deployed repo from GitHub and continued the work.

      Built **modular `backend/products/`** package (no monolith) with submodules:
        - models.py / security.py / upload.py / utils.py
        - public_routes.py, admin_routes.py, categories_routes.py
        - seed.py (20 default products + 5 default filter categories)
        - router.py (composite)
      Wired into server.py + static mount `/api/uploads/products/`.

      API (public): /api/products (filters: category, stock, q, sort, pagination), /api/products/{slug}, /api/products/{slug}/related, /api/products/categories, /api/products/search?q=
      API (admin, JWT): /api/admin/products GET/POST/PATCH/DELETE, /api/admin/products/upload-image, /api/admin/product-categories CRUD + /reorder

      Frontend:
        - New lib/products-api.ts (typed client)
        - Catalog refactored to consume API; filter taxonomy now admin-configurable
        - desktop1.tsx now reads slug → fetches product → renders dynamic tabs (Опис with description_html + image, Дозування/Склад/Сумісність/Характеристика as TabBlock structure)
        - FrameComponent6 accepts `product` prop — gallery, title, breadcrumb, feature row, volume options, price, in-stock badge all sourced from backend
        - SecondaryButton1 gained onClick → "Зателефонуйте мені" opens callback modal
        - Header-search now uses live /api/products/search?q= and navigates to /product/{slug}
        - App.tsx: added /product/:slug and /products/:slug routes
        - AdminLayout: new sidebar items Товари + Категорії товарів
        - AdminProducts.tsx: full table list + status/HOT toggles + delete + search
        - AdminProductEdit.tsx: full form (main info / опис with image upload / 4 product tabs editor / publishing flags / pricing / category select / photo gallery upload / rating / SEO)
        - AdminProductCategories.tsx: CRUD + reorder + inline edit + active toggle

      Verified via curl: create/list/patch/delete works for products and categories.
      Tested by testing_agent_v3 (iteration_3): backend 100% (57/57) — products 27/27 + blog 30/30; frontend 95% — all major flows working. Two LOW-priority findings were test-selector issues (not user-facing bugs).
