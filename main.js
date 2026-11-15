// Renders the homepage from data.js. Layout lives here; content lives in data.js.
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function parseDate(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function shortDate(iso) {
    var d = parseDate(iso);
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }
  function isExternal(url) { return /^(https?:|mailto:)/.test(url); }

  var ICONS = {
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || "ico") + '" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  var ARROW_UR = '<svg class="arrow arrow-ur" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
  var ARROW_R = '<svg class="arrow arrow-r" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var NEW_TAB = ' target="_blank" rel="noopener"';
  var NEW_TAB_SR = '<span class="sr-only"> (opens in a new tab)</span>';

  // ---------- hero text ----------
  document.querySelectorAll("[data-field]").forEach(function (el) {
    var v = S[el.getAttribute("data-field")];
    if (v) el.textContent = v;
  });

  // ---------- projects ----------
  var byYear = {};
  S.projects.forEach(function (p) { (byYear[p.year] = byYear[p.year] || []).push(p); });
  var years = Object.keys(byYear).sort(function (a, b) { return b - a; });
  document.getElementById("project-count").textContent =
    S.projects.length + (S.projects.length === 1 ? " project" : " projects");

  document.getElementById("project-list").innerHTML = years.map(function (y) {
    return '<div class="year reveal"><span>' + y + "</span></div>" + byYear[y].map(function (p) {
      var actions = '<a class="btn primary" href="' + esc(p.page) + '">Project page ' + ARROW_R + "</a>";
      if (p.code) actions += '<a class="btn" href="' + esc(S.repoUrl + "/" + p.code) + '"' + NEW_TAB + ">" + icon("code", "ico-s") + " Code" + NEW_TAB_SR + "</a>";
      if (p.video) actions += '<a class="btn" href="' + esc(p.video) + '"' + NEW_TAB + ">" + icon("play", "ico-s") + " Video" + NEW_TAB_SR + "</a>";
      return '<article class="project reveal">' +
        '<a class="thumb" href="' + esc(p.page) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(p.thumbnail) + '" alt="" width="1280" height="720" loading="lazy" decoding="async"></a>' +
        "<div>" +
          '<div class="project-top"><h3><a href="' + esc(p.page) + '">' + esc(p.title) + "</a></h3>" +
          (p.status ? '<span class="badge">' + esc(p.status) + "</span>" : "") + "</div>" +
          "<p>" + esc(p.summary) + "</p>" +
          '<ul class="chips" aria-label="Tools">' + p.tools.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul>" +
          '<div class="actions">' + actions + "</div>" +
        "</div></article>";
    }).join("");
  }).join("");

  // ---------- updates ----------
  var updates = S.updates.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  document.getElementById("update-list").innerHTML = updates.map(function (u) {
    return '<li class="reveal"><time datetime="' + esc(u.date) + '">' + shortDate(u.date) + "</time>" +
      '<div><span class="what">' + esc(u.text) + "</span>" + (u.project ? '<span class="tag">' + esc(u.project) + "</span>" : "") + "</div></li>";
  }).join("");

  // Activity grid: last 16 weeks, one square per day, shaded by number of updates.
  (function () {
    var WEEKS = 16;
    var counts = {};
    updates.forEach(function (u) { counts[u.date] = (counts[u.date] || 0) + 1; });
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var end = new Date(today); end.setDate(end.getDate() + (6 - end.getDay())); // Saturday this week
    var start = new Date(end); start.setDate(start.getDate() - WEEKS * 7 + 1);
    var cells = "", active = 0;
    for (var d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      var key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      var n = counts[key] || 0;
      if (n) active++;
      var cls = d > today ? "future" : n >= 3 ? "l3" : n === 2 ? "l2" : n === 1 ? "l1" : "";
      cells += '<i class="' + cls + '"' + (n ? ' title="' + shortDate(key) + ": " + n + (n === 1 ? " update" : " updates") + '"' : "") + "></i>";
    }
    document.getElementById("activity").innerHTML =
      '<div class="grid" aria-hidden="true">' + cells + "</div>" +
      "<figcaption>" + updates.length + " updates on " + active + " days in the last " + WEEKS + " weeks</figcaption>";
  })();

  if (updates.length) {
    document.getElementById("last-updated").textContent = "Last updated " + shortDate(updates[0].date);
  }

  // ---------- skills ----------
  document.getElementById("skill-list").innerHTML = S.skills.map(function (g, i) {
    return '<div class="skill-row reveal"><div class="label"><b>' + String(i + 1).padStart(2, "0") + "</b>" + esc(g.group) + "</div>" +
      '<ul class="chips">' + g.items.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul></div>";
  }).join("");

  // ---------- contact links ----------
  document.getElementById("link-list").innerHTML = S.links.filter(function (l) { return l.url; }).map(function (l) {
    var ext = isExternal(l.url) && l.url.indexOf("mailto:") !== 0;
    return '<li><a href="' + esc(l.url) + '"' + (ext ? NEW_TAB : "") + ">" + icon(l.icon) +
      '<span class="txt"><b>' + esc(l.label) + "</b><span>" + esc(l.handle) + "</span></span>" +
      (ext ? NEW_TAB_SR : "") + ARROW_UR + "</a></li>";
  }).join("");

  // ---------- hero: simulated bankroll paths (decorative) ----------
  // Same assumptions as the bankroll model: 5 bb/100 win rate, 90 bb/100 std dev,
  // $2,000 start = 1,000 big blinds at $1/$2, 100 blocks of 100 hands. A path that hits 0 stays at 0.
  (function () {
    var svg = document.getElementById("paths");
    if (!svg) return;
    var NS = "http://www.w3.org/2000/svg";
    var N = 40, STEPS = 100, MU = 5, SD = 90, START = 1000;

    function rng(seed) { // mulberry32: same picture on every visit
      return function () {
        seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
        var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    var rand = rng(20261111);
    function normal() { var u = 1 - rand(), v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

    var paths = [];
    for (var i = 0; i < N; i++) {
      var b = START, pts = [b];
      for (var s = 0; s < STEPS; s++) { b = b <= 0 ? 0 : Math.max(0, b + MU + SD * normal()); pts.push(b); }
      paths.push(pts);
    }
    // Highlight the best and worst finishers.
    var order = paths.map(function (p, i) { return [p[STEPS], i]; }).sort(function (a, b) { return a[0] - b[0]; });
    var worst = order[0][1], best = order[N - 1][1];
    var maxB = Math.max.apply(null, paths.map(function (p) { return Math.max.apply(null, p); }));

    function draw() {
      var w = svg.clientWidth || 720, h = svg.clientHeight || 200, top = 38, bottom = h - 8;
      svg.setAttribute("viewBox", "0 0 " + w + " " + h);
      svg.textContent = "";
      function y(v) { return bottom - (v / maxB) * (bottom - top); }
      var start = document.createElementNS(NS, "path");
      start.setAttribute("d", "M0 " + y(START) + "H" + w);
      start.setAttribute("class", "start");
      svg.appendChild(start);
      paths.forEach(function (p, i) {
        var d = p.map(function (v, k) { return (k ? "L" : "M") + (k / STEPS * w).toFixed(1) + " " + y(v).toFixed(1); }).join("");
        var el = document.createElementNS(NS, "path");
        el.setAttribute("d", d);
        el.setAttribute("pathLength", "1");
        var cls = i === best ? "p-up" : i === worst ? "p-down" : "p";
        el.setAttribute("class", cls + (reduceMotion ? "" : " draw"));
        if (!reduceMotion) el.style.cssText = "--len:1;--d:" + (cls === "p" ? (i % 10) * 0.05 : 0.5) + "s";
        if (cls === "p") svg.insertBefore(el, svg.firstChild.nextSibling); else svg.appendChild(el);
      });
    }
    draw();
    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { reduceMotion = true; draw(); }, 150); // no re-animation on resize
    });
  })();

  // ---------- scroll reveal ----------
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 0.05 + "s";
      io.observe(el);
    });
  }

  // ---------- active section in the nav ----------
  var navLinks = document.querySelectorAll('.topbar nav a, .ticks a');
  var sections = ["top", "projects", "updates", "skills", "contact"].map(function (id) { return document.getElementById(id); });
  function setActive() {
    var line = window.innerHeight * 0.35, current = "top";
    sections.forEach(function (s) { if (s && s.getBoundingClientRect().top <= line) current = s.id; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = "contact";
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  setActive();
})();
