/* IntimoBruna - shop page (dyqani*.html): renders the items for sale from
   data/products.json. Items are managed from admin.html, which commits the JSON
   (and photos) to the repo. While the list is empty (or unreachable) the page
   shows the "coming soon" note instead of an empty grid. */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/355692939750";
  var FALLBACK_IMG = "assets/img/logo.jpeg";

  var STRINGS = {
    sq: {
      order: "Porosit në WhatsApp", more: "Lexo më shumë", less: "Lexo më pak",
      all: "Të gjitha", emptyCat: "Asgjë në këtë kategori ende. Shihni «Të gjitha» ose na shkruani në WhatsApp.",
      message: function (p) { return "Përshëndetje IntimoBruna, jam i/e interesuar për \"" + p.name + "\" (" + p.price + ")."; }
    },
    it: {
      order: "Ordina su WhatsApp", more: "Leggi di più", less: "Leggi meno",
      all: "Tutte", emptyCat: "Ancora niente in questa categoria. Guarda «Tutte» o scrivici su WhatsApp.",
      message: function (p) { return "Salve IntimoBruna, sono interessato/a a \"" + p.name + "\" (" + p.price + ")."; }
    },
    en: {
      order: "Order on WhatsApp", more: "Read more", less: "Read less",
      all: "All", emptyCat: "Nothing in this category yet. See «All» or message us on WhatsApp.",
      message: function (p) { return "Hello IntimoBruna, I'm interested in \"" + p.name + "\" (" + p.price + ")."; }
    }
  };

  /* Product categories: slugs live in data/products.json (set from the admin
     dropdown); labels are per language. "Gjysma për vajza" stays Albanian on
     IT/EN on purpose: the owner's own term, no guessed translation.
     Keep this list in the SAME ORDER as admin.js CATEGORIES. */
  var CATS = [
    ["recipeta",              { sq: "Reçipeta", it: "Reggiseni", en: "Bras" }],
    ["mbathje",               { sq: "Mbathje", it: "Slip", en: "Briefs" }],
    ["tanga",                 { sq: "Tanga", it: "Tanga", en: "Thongs" }],
    ["sete-tyl",              { sq: "Sete tyl", it: "Completi in tulle", en: "Tulle sets" }],
    ["gjysma-vajza",          { sq: "Gjysma për vajza", it: "Gjysma për vajza", en: "Gjysma për vajza" }],
    ["kanatjere-vajza",       { sq: "Kanatjere vajzash", it: "Canottiere ragazza", en: "Girls' tank tops" }],
    ["kanatjere-burra",       { sq: "Kanatjere burrash", it: "Canottiere uomo", en: "Men's tank tops" }],
    ["bluze-shkurtra",        { sq: "Bluze me krahë të shkurtra", it: "Maglie a maniche corte", en: "Short-sleeve tops" }],
    ["bluze-gjata",           { sq: "Bluze me krahë të gjata", it: "Maglie a maniche lunghe", en: "Long-sleeve tops" }],
    ["kanatjere-femije",      { sq: "Kanatjere për fëmijë", it: "Canottiere bambini", en: "Kids' tank tops" }],
    ["bluze-femije-shkurtra", { sq: "Bluze fëmijësh me krahë të shkurtra", it: "Maglie bambini a maniche corte", en: "Kids' short-sleeve tops" }],
    ["bluze-femije-gjata",    { sq: "Bluze fëmijësh me krahë të gjata", it: "Maglie bambini a maniche lunghe", en: "Kids' long-sleeve tops" }],
    ["bokse",                 { sq: "Bokse meshkuj", it: "Boxer uomo", en: "Men's boxers" }]
  ];

  var grid = document.querySelector(".shop-grid");
  var empty = document.getElementById("shopEmpty");
  if (!grid) return;

  var lang = document.documentElement.lang;
  if (lang !== "it" && lang !== "en") lang = "sq";
  var t = STRINGS[lang];
  function catLabel(slug) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === slug) return CATS[i][1][lang];
    return "";
  }

  /* lowercase + strip diacritics, so "kerko" matches "Kërko" and search is accent-insensitive */
  function norm(s) {
    return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  /* ?ts= skips the ~10-minute GitHub Pages cache so freshly published items appear right away */
  fetch("data/products.json?ts=" + Date.now(), { cache: "no-store" })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      var products = (data && data.products) || [];
      products.forEach(function (p) {
        if (p && p.name) grid.appendChild(buildCard(p));
      });
      /* the "coming soon" note is visible by default (works with JS off);
         hide it only once real items are on the page */
      if (grid.children.length && empty) empty.hidden = true;
      if (grid.children.length) { setupCats(); setupSearch(); setupDescToggles(); }
    })
    .catch(function () { /* note stays visible */ });

  /* Descriptions are clamped to a few lines so cards stay tidy regardless of length.
     Runs after cards are in the DOM (needs layout): if a description is taller than its
     clamp, add a "read more" toggle so the full text is still reachable. */
  function setupDescToggles() {
    Array.prototype.forEach.call(grid.querySelectorAll(".shop-desc"), function (desc) {
      if (desc.scrollHeight <= desc.clientHeight + 2) return; // not clamped, no toggle needed
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shop-desc-toggle";
      btn.textContent = t.more;
      btn.addEventListener("click", function () {
        var open = desc.classList.toggle("expanded");
        btn.textContent = open ? t.less : t.more;
      });
      desc.parentNode.insertBefore(btn, desc.nextSibling); // between the description and the WhatsApp button
    });
  }

  /* One filter for both controls: a card shows when it matches the active
     category AND the search text. All cards are already in the DOM. */
  var activeCat = "";
  function applyFilter() {
    var input = document.getElementById("shopSearchInput");
    var noResults = document.getElementById("shopNoResults");
    var q = input ? norm(input.value.trim()) : "";
    var visible = 0;
    Array.prototype.forEach.call(grid.children, function (card) {
      var okCat = !activeCat || card.dataset.cat === activeCat;
      var okText = !q || (card.dataset.search || "").indexOf(q) !== -1;
      var match = okCat && okText;
      card.hidden = !match;
      if (match) visible++;
    });
    if (noResults) {
      if (visible === 0 && activeCat && !q) {
        /* an empty category gets its own honest note, not "no search results" */
        noResults.textContent = t.emptyCat;
        noResults.hidden = false;
      } else if (visible === 0 && q) {
        noResults.textContent = noResults.dataset.noMatch;
        noResults.hidden = false;
      } else {
        noResults.hidden = true;
      }
    }
  }

  /* Category chip bar: every category is always visible (the owner's choice),
     the active one highlighted. Chips only filter; they never navigate. */
  function setupCats() {
    var bar = document.getElementById("shopCats");
    var noResults = document.getElementById("shopNoResults");
    if (noResults && !noResults.dataset.noMatch) noResults.dataset.noMatch = noResults.textContent;
    if (!bar) return;
    function chip(slug, label) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "shop-cat" + (slug === activeCat ? " on" : "");
      b.textContent = label;
      b.addEventListener("click", function () {
        activeCat = slug;
        Array.prototype.forEach.call(bar.children, function (c) { c.classList.remove("on"); });
        b.classList.add("on");
        applyFilter();
      });
      return b;
    }
    bar.appendChild(chip("", t.all));
    CATS.forEach(function (c) { bar.appendChild(chip(c[0], c[1][lang])); });
    bar.hidden = false;
  }

  function setupSearch() {
    var box = document.getElementById("shopSearch");
    var input = document.getElementById("shopSearchInput");
    if (!box || !input) return;
    box.hidden = false;
    input.addEventListener("input", applyFilter);
  }

  function buildCard(p) {
    var card = document.createElement("article");
    card.className = "card shop-card";
    card.dataset.cat = p.category || "";
    card.dataset.search = norm(p.name + " " + (p.description || "") + " " + (p.price || "") + " " + catLabel(p.category || ""));

    var media = document.createElement("div");
    media.className = "card-media";
    var img = document.createElement("img");
    img.src = p.image || FALLBACK_IMG;
    img.alt = p.name;
    img.loading = "lazy";
    img.onerror = function () { this.onerror = null; this.src = FALLBACK_IMG; };
    media.appendChild(img);

    var body = document.createElement("div");
    body.className = "card-body";

    var name = document.createElement("h3");
    name.textContent = p.name;

    var price = document.createElement("p");
    price.className = "shop-price";
    price.textContent = p.price || "";

    body.appendChild(name);
    body.appendChild(price);
    if (p.description) {
      var desc = document.createElement("p");
      desc.className = "shop-desc";
      desc.textContent = p.description;
      body.appendChild(desc);
    }

    var btn = document.createElement("a");
    btn.className = "btn btn-gold btn-sm shop-order";
    btn.href = WA_BASE + "?text=" + encodeURIComponent(t.message(p));
    btn.target = "_blank";
    btn.rel = "noopener";
    var glyph = document.createElement("span");
    glyph.className = "wa-glyph";
    glyph.setAttribute("aria-hidden", "true");
    btn.appendChild(glyph);
    btn.appendChild(document.createTextNode(" " + t.order));

    body.appendChild(btn);
    card.appendChild(media);
    card.appendChild(body);
    return card;
  }
})();
