/* IntimoBruna - edge layer on Cloudflare, in front of GitHub Pages.
   GitHub Pages stays the origin and publishing is unchanged (the admin page still commits to the
   repo). This Worker only adds what Pages cannot send itself: security headers, long cache lifetimes
   for versioned and fingerprinted files, and one address for the Albanian homepage.
   The folder name starts with "_" so GitHub Pages never publishes it. Deploy from this folder with
   `npx wrangler@4 deploy`; remove with `npx wrangler delete --name intimobruna-edge`. */

/* The homepage's canonical URL is "/"; these aliases answer 200 on GitHub Pages too. */
const HOME_ALIASES = new Set(["/index.html", "/index"]);

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN"
};

const ONE_YEAR = "public, max-age=31536000, immutable";
const THIRTY_DAYS = "public, max-age=2592000";

/* Browser cache lifetime by path, or null to keep the origin's (10 minutes on GitHub Pages).
   - Shop photos get a new timestamped name on every upload, so a URL never changes content.
   - CSS/JS are always linked with ?v=N and the number is bumped whenever the file changes.
   - Other images: replace a photo under a NEW name, or returning visitors keep the old one
     for up to 30 days.
   - HTML, sitemap, llms.txt and data/products.json stay short so updates show up quickly
     (shop.js also fetches the product list with no-store). */
function cacheControl(url) {
  const path = url.pathname;
  if (path.startsWith("/assets/img/shop/") || path.startsWith("/assets/fonts/")) return ONE_YEAR;
  if (/\.(css|js)$/.test(path) && url.searchParams.has("v")) return ONE_YEAR;
  if (path.startsWith("/assets/")) return THIRTY_DAYS;
  return null;
}

export default {
  async fetch(request, env, ctx) {
    /* If anything here throws, the request goes straight to GitHub Pages instead of failing. */
    ctx.passThroughOnException();

    const url = new URL(request.url);
    if (HOME_ALIASES.has(url.pathname)) {
      url.pathname = "/";
      return Response.redirect(url.toString(), 301);
    }

    const origin = await fetch(request);
    const response = new Response(origin.body, origin);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      response.headers.set(name, value);
    }

    /* 304 and 206 carry the lifetime too: a revalidation answer replaces the cached headers. */
    const lifetime = [200, 206, 304].includes(origin.status) ? cacheControl(url) : null;
    if (lifetime) {
      response.headers.set("Cache-Control", lifetime);
      response.headers.delete("Expires");
    }

    /* The repo's README is reachable on the site but is not a page for search results. */
    if (url.pathname === "/README.md") response.headers.set("X-Robots-Tag", "noindex");

    return response;
  }
};
