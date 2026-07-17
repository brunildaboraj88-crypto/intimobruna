/* IntimoBruna - homepage interactions (WhatsApp links, nav, scroll-reveal, year) */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/355692939750";

  /* WhatsApp deep links: build ?text= from each element's data-wa (plain text, encoded here).
     The plain href is a working fallback when JavaScript is off. */
  Array.prototype.forEach.call(document.querySelectorAll("a[data-wa]"), function (a) {
    var msg = a.getAttribute("data-wa");
    if (msg) a.setAttribute("href", WA_BASE + "?text=" + encodeURIComponent(msg));
  });

  /* Mobile nav toggle */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function closeNav() {
    if (!links) return;
    links.classList.remove("open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Header shadow on scroll */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Scroll-reveal (respects reduced motion) */
  var reveals = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Hero video: opt in rather than out. The file is ~4.7 MB, so it is only worth fetching on a
     wide screen with a connection that is not metered or slow. Everyone else keeps the poster,
     which is a real product photo and is preloaded in the head. */
  var hero = document.querySelector(".hero-video");
  if (hero && hero.dataset.src) {
    var conn = navigator.connection || {};
    var thrifty = conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || "");
    var wide = window.matchMedia("(min-width: 761px)").matches;

    if (wide && !thrifty && !prefersReduced) {
      var source = document.createElement("source");
      source.src = hero.dataset.src;
      source.type = "video/mp4";
      hero.appendChild(source);
      hero.classList.add("hero-video--live"); // turns off the CSS poster drift
      hero.load();
    }
  }

  /* Current year in footer */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
