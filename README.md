# IntimoBruna Website

A trilingual (Albanian / Italian / English) showcase site for **IntimoBruna**, a
family-run intimates shop in Durrës, Albania. Plain static site (HTML/CSS/JS) with
no build step and no dependencies. Orders come in over WhatsApp.

27 crawlable pages: 3 homepages, 3 shop pages, 6 legal pages, 3 blog listings, and
4 blog posts in 3 languages.

## Files

```
index.html            Homepage (Albanian, the base language)
index.it.html         Homepage (Italian)
index.en.html         Homepage (English)
styles.css            All styling (design system + layout)
script.js             Homepage: WhatsApp links, menu, scroll effects, reveals, year
blog/
  index.html          Article listing (Albanian; .it.html / .en.html alongside)
  <slug>.html         One article per file (.it.html / .en.html alongside)
  blog.js             Blog pages: menu toggle, header shadow, year
assets/
  video/hero.mp4      Hero background video
  img/                Logo + product photos
404.html              Branded not-found page
robots.txt            Crawl rules + sitemap pointer
sitemap.xml           All 27 pages with hreflang alternates
llms.txt              Summary + link list for AI crawlers
_cloudflare/          Cloudflare edge Worker (headers, caching, homepage redirect); never published
README.md             This file
```

The original media (the loose `Herovid.mp4`, `LogoIntimoBruna.jpeg`, and
`WhatsApp Image ...` photos) are still in the folder on disk, untouched, but are
git-ignored: they are exact duplicates of the cleaned-up copies in `assets/`,
which is what the site actually serves.

## Preview it locally

**Quick look:** double-click `index.html` to open it in your browser. Links back to the
Albanian homepage point at the folder (`./`, `../`), the way the live site wants them, so
clicking around works properly only through a local server:

**Recommended** (matches how it behaves when hosted). From this folder run:

```bash
python -m http.server 8000
```

then open http://localhost:8000 in your browser.

## Things you can edit

Copy lives directly in the HTML files, one per language. A few common edits:

- **WhatsApp number.** It's the phone `355692939750` inside every `wa.me/...` link.
  If it changes, find and replace it across **all** HTML files.
- **Opening hours.** Currently every day (Monday to Sunday), 08:00 to 21:00. They appear
  in several places: the visible "Visit us" text and the FAQ answer **and** their JSON-LD
  (`openingHoursSpecification` + the `FAQPage` answer, which must match the visible FAQ
  text) on all three homepages, the "Visit" band on the three `dyqani` pages, and
  `llms.txt`. Update every one when they change.
- **Address / map.** The address text reads *Rruga Aleksandër Goga, Durrës 2001, Albania*.
  The map embed and the "Get directions" button both point to the exact map pin
  (coordinates `41.320088,19.445277`). Update those if the location changes.
- **Instagram / Facebook / TikTok.** Live in the footer of every page and in the
  `sameAs` arrays of the JSON-LD on the homepages.
- **Colors.** The gold/black/white palette is defined once at the top of
  `styles.css` under `:root` (`--gold`, `--ink`, etc.).
- **Cache-busting.** Both `styles.css` and the `.js` files are referenced with a
  `?v=N` query in the HTML (e.g. `shop.js?v=2`, `styles.css?v=9`). **Bump that number
  whenever you change a CSS or JS file.** Browsers keep a versioned CSS/JS file for a
  year (see `_cloudflare/`), so without a new number your change won't reach returning
  visitors. Images under `assets/` are kept for 30 days: to replace a photo, save the
  new one under a **new file name** and update the HTML.
- **Fonts.** Playfair Display and Montserrat are self-hosted from `assets/fonts/`
  (declared with `@font-face` at the bottom of `styles.css`), so pages no longer wait
  on fonts.googleapis.com. The shop and admin pages still carry the old Google Fonts
  link tag; that is intentional (those files are frozen) and harmless: the local
  `@font-face` rules win and the type renders identically.
- **Page scoping.** Rules under the `body.general` block at the bottom of `styles.css`
  apply only to pages carrying `<body class="general">` (homepages, blog, legal, 404).
  The shop (`dyqani*.html`) and `admin.html` do not have the class, so those rules can
  never change how they render. Keep it that way: shop and admin are edit-frozen at the
  owner's request; new site-wide styling goes in the `.general` scope.

## Languages (Albanian / Italian / English)

The site is trilingual with a **SQ · IT · EN** switcher in the header.

**Each language is its own file.** There is no runtime translation and no JavaScript
involved in language selection, so every page works with JS off and search engines
index all three versions separately:

- `index.html` (Albanian, the base language), `index.it.html`, `index.en.html`
- the same pattern in `blog/`

The switcher is a set of plain **links** between the three versions; the current one
is marked with `aria-current="page"`. Every page declares its siblings with
`hreflang` tags (`sq` / `it` / `en`, plus `x-default` pointing at Albanian) and an
absolute `canonical` URL.

To change text in one language, edit that language's file. There is **no** shared
dictionary: a copy change usually means editing all three files.

## Blog

The blog lives in the `blog/` folder and is **trilingual (SQ / IT / EN)**, four posts
in each language:

- `blog/index.html`: the article listing page (Albanian), plus `index.it.html` / `index.en.html`.
- `blog/<slug>.html`: one article per file, Albanian (e.g. `blog/rroba-banje-vere-durres.html`).
- `blog/<slug>.it.html` and `blog/<slug>.en.html`: the Italian and English versions
  of the same article (same slug, with a language suffix).
- `blog/blog.js`: small script for the blog pages (menu toggle, header shadow, footer year).

**To add a new post:** create the Albanian file first (copy an existing one,
rename to a short slug, change the title/date/text and lead image
`../assets/img/...`). Then copy it to `<slug>.it.html` and `<slug>.en.html` and
translate. In all three, update the `canonical`, the `hreflang` links, the switcher
`href`s, and the JSON-LD (`BlogPosting` + `BreadcrumbList`, and the `FAQPage` if the
post has an FAQ; the FAQ schema text must match the visible FAQ text exactly).
Then add a card to each `blog/index*.html` (visible card **and** the `blogPost` array
in its JSON-LD), add a card to the "Nga blogu" section of the matching homepage, and
add the three new URLs to `sitemap.xml`. Each post ends with a "visit us / WhatsApp"
call-to-action that drives readers to the shop.

Planned future topics: caring for lingerie, bras for every occasion, shapewear guide,
holiday gift guide, maternity & nursing.

## SEO / GEO setup

The site is tuned for search engines and AI answer engines. Key facts and files:

- **Canonical domain:** `https://intimobruna.com`. All canonical URLs, the sitemap,
  Open Graph tags and structured data use this exact host; `www.` 301-redirects to it.
  The Albanian homepage's address is `/`, so link to it as `./` (or `../` from `blog/`),
  never as `index.html`; the edge Worker 301-redirects `/index.html` to `/` anyway.
  If you use a **different domain**, find-and-replace `intimobruna.com` across the files.
- **`sitemap.xml`**: all 27 pages with `hreflang` alternates. Re-add an entry whenever
  you publish a new page, and move a page's `<lastmod>` only when its content really
  changes. The shop pages carry none, because their items change daily.
- **`robots.txt`**: allows crawling and points to the sitemap.
- **`llms.txt`**: a summary + link list for AI crawlers (ChatGPT, Perplexity, etc.).
- **`404.html`**: branded not-found page. GitHub Pages serves it at any missing address,
  however deep, so every link and asset in it is root-absolute (`/styles.css`, `/`).
- **`_cloudflare/`**: the edge Worker, see "Hosting" below.
- **Structured data (JSON-LD):** homepages carry `ClothingStore` (the single business
  entity, which is also the `WebSite` publisher) + `WebSite` + `FAQPage`; blog listings
  carry `Blog` + `BreadcrumbList`; blog posts carry
  `BlogPosting` + `BreadcrumbList` (+ `HowTo` on the fit guide) + `FAQPage`. If you
  change the **opening hours, address or phone**, update them in the visible text
  **and** the JSON-LD `<script>` blocks (search the files for
  `openingHoursSpecification` and `+355 69 293 9750`).
- After it's live, submit the sitemap in **Google Search Console** and make sure the
  Google Business Profile uses the same name/address/phone as the site.

## Hosting

**GitHub Pages** serves the site from the `main` branch: every push (including the
admin page's commits) is live in about a minute. **Cloudflare** runs the DNS for
`intimobruna.com` and sits in front of GitHub Pages as a proxy.

GitHub Pages cannot send custom HTTP headers, so a small **Cloudflare Worker** in
`_cloudflare/` adds them at the edge. It does not change how anything is published:

- security headers (`Strict-Transport-Security`, `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options`) on every response;
- long browser caching: a year for versioned CSS/JS (`?v=N`), fonts and shop photos;
  30 days for other files under `assets/`; HTML and `data/products.json` stay at
  GitHub's 10 minutes;
- a 301 from `/index.html` to `/`, and `noindex` on this README.

The folder starts with `_`, so GitHub Pages never publishes it. To change the Worker,
edit `_cloudflare/worker.js`, then run wrangler from **inside** that folder while logged
in to the Cloudflare account that holds the domain:

```bash
cd _cloudflare
npx wrangler@4 deploy
```

To switch it off (GitHub Pages then answers directly again):
`npx wrangler delete --name intimobruna-edge`.

Settings that live only in the Cloudflare dashboard, not in this repo: AI Crawl Control
(AI crawlers allowed, except Bytespider), Crawler Hints on, and "fail open" on the
Worker route, so the site still loads if the Worker's free daily limit is ever reached.

## Shop page + admin page

The shop is a dedicated page, `dyqani.html` (Albanian) with `dyqani.it.html` /
`dyqani.en.html` alongside, listing individual items for sale (name, price, photo,
and a WhatsApp order button). It is linked from the nav and footer of every page.
The items live in one shared data file:

- `data/products.json`: the list of items (same items on all three languages;
  names/prices appear exactly as typed). **Ships empty**: items are added only from
  the admin page; never hardcode names or prices in the repo. While the list is
  empty the page shows a "coming soon" note with a WhatsApp button.
- `shop.js`: loaded by the three shop pages; renders the cards from the JSON.
- `assets/img/shop/`: photos uploaded from the admin page land here.

### Managing items: `admin.html`

Open `https://intimobruna.com/admin.html` and log in (the page is noindexed and
blocked in robots.txt). From there you can **add** an item (name, price, optional
photo; photos are automatically shrunk in the browser before upload) and **remove**
existing ones.

Because the site is static, the admin page publishes changes by committing
`data/products.json` (and photos) to this GitHub repository through the GitHub API.
GitHub Pages then redeploys automatically, so changes are live in ~1–2 minutes.

**One-time setup per device: the publish key.** Saving changes requires a GitHub
fine-grained personal access token: github.com → Settings → Developer settings →
Fine-grained personal access tokens → Generate new token → Repository access: only
`intimobruna` → Permissions: **Contents – Read and write**. Paste it into the
"Çelësi i publikimit" box on the admin page. It is stored only in that browser's
localStorage (never in the repo). Tokens expire (1 year max), so renew it when
GitHub emails you.

**Security note:** `admin.js` is served to every visitor of the live site, so its
contents are public no matter whether the repo is public or private; the file must
therefore contain nothing that reveals the password. It stores only a **salted PBKDF2**
hash (250k iterations) of `username:password`, so a strong password cannot be recovered
from it even by someone reading the source. The login is still client-side, so a
technical visitor could skip the prompt to *view* the (empty) dashboard, but cannot
publish anything without the **GitHub token**, which lives only in the owner's browser
and is never in the repo; that token is the real protection.

To change the login: open `/admin.html`, and in the browser console (F12) run
`ibHash("bruna", "the-new-password").then(console.log)`, then replace `LOGIN_HASH` in
`admin.js` with the printed value and commit. Use a strong password (not a dictionary
word) so the published hash stays uncrackable.

Note: items added via the admin page land in the GitHub repository, so `git pull`
before working on the code locally.
