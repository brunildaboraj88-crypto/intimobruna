# IntimoBruna Website

A trilingual (Albanian / Italian / English) showcase site for **IntimoBruna**, a
family-run intimates shop in Durrës, Albania. Plain static site (HTML/CSS/JS) with
no build step and no dependencies. Orders come in over WhatsApp.

18 crawlable pages: 3 homepages, 3 blog listings, and 4 blog posts in 3 languages.

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
sitemap.xml           All 18 pages with hreflang alternates
llms.txt              Summary + link list for AI crawlers
netlify.toml          Host config (www -> apex redirect, caching, headers)
README.md             This file
```

The original media (the loose `Herovid.mp4`, `LogoIntimoBruna.jpeg`, and
`WhatsApp Image ...` photos) are still in the folder on disk, untouched, but are
git-ignored: they are exact duplicates of the cleaned-up copies in `assets/`,
which is what the site actually serves.

## Preview it locally

**Easiest:** double-click `index.html` to open it in your browser.

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
  whenever you change a CSS or JS file**, otherwise browsers (and Cloudflare) keep
  serving the old cached copy and your change won't reach visitors.

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
  Open Graph tags and structured data use this exact host. If you set up hosting on
  `www.`, keep the apex as primary (the included `netlify.toml` 301-redirects www → apex).
  If you use a **different domain**, find-and-replace `intimobruna.com` across the files.
- **`sitemap.xml`**: all 18 pages with `hreflang` alternates. Re-add an entry whenever
  you publish a new page.
- **`robots.txt`**: allows crawling and points to the sitemap.
- **`llms.txt`**: a summary + link list for AI crawlers (ChatGPT, Perplexity, etc.).
- **`404.html`**: branded not-found page (most hosts serve it automatically).
- **`netlify.toml`**: host config: www → apex redirect, asset caching, safe headers.
  Only used on Netlify; on another host replicate the redirect + cache rules there.
- **Structured data (JSON-LD):** homepages carry `ClothingStore`/`Organization`/`WebSite`
  + `FAQPage`; blog listings carry `Blog` + `BreadcrumbList`; blog posts carry
  `BlogPosting` + `BreadcrumbList` (+ `HowTo` on the fit guide) + `FAQPage`. If you
  change the **opening hours, address or phone**, update them in the visible text
  **and** the JSON-LD `<script>` blocks (search the files for
  `openingHoursSpecification` and `+355 69 293 9750`).
- After it's live, submit the sitemap in **Google Search Console** and make sure the
  Google Business Profile uses the same name/address/phone as the site.

## Publish it online (free)

The site is a plain static folder, so any static host works. The repo already includes
a `netlify.toml`, so **Netlify** is the smoothest path:

1. At https://app.netlify.com, choose "Add new site" then "Import an existing project".
2. Connect GitHub and pick this repository.
3. Leave the build command empty and set the publish directory to `.` (there is no
   build step). Netlify picks up `netlify.toml` automatically.
4. Add `intimobruna.com` as a custom domain and point the DNS at Netlify.

Every push to `main` then redeploys the site automatically.

**No-git alternative:** drag this folder onto https://app.netlify.com/drop for an
instant URL. Other options: Vercel, Cloudflare Pages, GitHub Pages, or classic FTP
hosting. On a host other than Netlify, replicate the redirect and cache rules from
`netlify.toml` yourself.

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
