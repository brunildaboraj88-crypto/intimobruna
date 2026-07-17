/* IntimoBruna — shop section: renders the items for sale from data/products.json.
   Items are managed from admin.html, which commits the JSON (and photos) to the repo. */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/355692939750";
  var FALLBACK_IMG = "assets/img/logo.jpeg";

  var STRINGS = {
    sq: {
      order: "Porosit në WhatsApp",
      message: function (p) { return "Përshëndetje IntimoBruna, jam i/e interesuar për \"" + p.name + "\" (" + p.price + ")."; }
    },
    it: {
      order: "Ordina su WhatsApp",
      message: function (p) { return "Salve IntimoBruna, sono interessato/a a \"" + p.name + "\" (" + p.price + ")."; }
    },
    en: {
      order: "Order on WhatsApp",
      message: function (p) { return "Hello IntimoBruna, I'm interested in \"" + p.name + "\" (" + p.price + ")."; }
    }
  };

  var section = document.getElementById("shop");
  var grid = section ? section.querySelector(".shop-grid") : null;
  if (!grid) return;

  var t = STRINGS[document.documentElement.lang] || STRINGS.sq;

  /* ?ts= skips the ~10-minute GitHub Pages cache so freshly published items appear right away */
  fetch("data/products.json?ts=" + Date.now())
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      var products = data && data.products;
      if (!products || !products.length) return;
      products.forEach(function (p) {
        if (p && p.name) grid.appendChild(buildCard(p));
      });
      if (grid.children.length) section.hidden = false;
    })
    .catch(function () { /* the section simply stays hidden */ });

  function buildCard(p) {
    var card = document.createElement("article");
    card.className = "card shop-card";

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

    body.appendChild(name);
    body.appendChild(price);
    body.appendChild(btn);
    card.appendChild(media);
    card.appendChild(body);
    return card;
  }
})();
