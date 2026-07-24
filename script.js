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

  /* Hero video: plays on phones too, not just desktop. It is still skipped for anyone who
     asked for less data (Save-Data / 2G / 3G) or less motion; they keep the poster, which is
     a real product photo and is preloaded in the head. The source is attached on window load
     so the multi-MB video never competes with the poster, fonts and images for first paint. */
  var hero = document.querySelector(".hero-video");
  if (hero && hero.dataset.src) {
    var conn = navigator.connection || {};
    var thrifty = conn.saveData === true || /(^|-)(2g|3g)$/.test(conn.effectiveType || "");

    if (!thrifty && !prefersReduced) {
      var startHero = function () {
        var source = document.createElement("source");
        source.src = hero.dataset.src;
        source.type = "video/mp4";
        hero.appendChild(source);
        hero.classList.add("hero-video--live"); // turns off the CSS poster drift
        hero.load();
        /* Some mobile browsers ignore the autoplay attribute on a source added after parsing.
           The video is muted + playsinline, so this is allowed; a blocked promise is harmless. */
        var playing = hero.play();
        if (playing && playing.catch) playing.catch(function () {});
      };
      if (document.readyState === "complete") startHero();
      else window.addEventListener("load", startHero, { once: true });
    }
  }

  /* Current year in footer */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
