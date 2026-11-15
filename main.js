// Renders the homepage from data.js and wires up the sticker interactions.
// Layout lives here; content lives in data.js; artwork lives in stickers.js.
(function () {
  "use strict";
  var S = window.SITE, ART = window.STICKERS;
  if (!S || !ART) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---------- helpers ----------
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function rich(s) { return esc(s).replace(/\{b\}/g, "<b>").replace(/\{\/b\}/g, "</b>"); }
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function monthKey(iso) { return iso.slice(0, 7); }
  function monthLabel(key) { var p = key.split("-"); return MONTHS[+p[1] - 1] + " " + p[0]; }
  function isExternal(url) { return /^https?:/.test(url); }

  var ICONS = {
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    check: '<path d="M20 6 9 17l-5-5"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || "ico") + '" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  var ARROW_UR = '<svg class="arrow arrow-ur" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
  var ARROW_R = '<svg class="arrow arrow-r" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var NEW_TAB = ' target="_blank" rel="noopener"';
  var NEW_TAB_SR = '<span class="sr-only"> (opens in a new tab)</span>';

  document.body.insertAdjacentHTML("afterbegin", ART.DEFS);

  // ---------- hero text ----------
  document.querySelectorAll("[data-field]").forEach(function (el) {
    var v = S[el.getAttribute("data-field")];
    if (v) el.textContent = v;
  });
  $("name-mini").innerHTML = ART.mini("chart");

  // Local time tooltip on the location
  (function () {
    var tip = $("loc-time");
    if (!tip || !S.timeZone) return;
    var fmt;
    try { fmt = new Intl.DateTimeFormat("en-US", { timeZone: S.timeZone, hour: "numeric", minute: "2-digit", second: "2-digit" }); }
    catch (e) { return; }
    function tick() { tip.textContent = fmt.format(new Date()) + " here"; }
    tick();
    setInterval(tick, 1000);
  })();

  // ---------- stickers ----------
  var STICKERS = [
    { key: "sheet", label: "spreadsheet" },
    { key: "dash", label: "chart dashboard" },
    { key: "calc", label: "calculator" },
    { key: "coffee", label: "coffee" },
    { key: "chip", label: "poker chip" }
  ];
  $("stickers").innerHTML = STICKERS.map(function (s) {
    return '<div class="sticker st-' + s.key + ' pre" data-key="' + s.key + '">' +
      '<button type="button" aria-label="Animate the ' + s.label + ' sticker"><div class="body">' + ART[s.key]() + "</div></button></div>";
  }).join("");
  $("avatar").innerHTML = '<button type="button" aria-label="Wave the DR badge"><div class="body">' + ART.avatar() + "</div></button>";

  // Entrance: stickers rise and settle one after another
  var stickerEls = document.querySelectorAll(".sticker");
  if (reduceMotion) {
    stickerEls.forEach(function (el) { el.classList.remove("pre"); });
  } else {
    stickerEls.forEach(function (el, i) {
      setTimeout(function () { el.classList.remove("pre"); }, 150 + i * 90);
    });
  }

  // 3D tilt that follows the cursor
  function tilt(host, target, max, scale) {
    if (!finePointer || reduceMotion) return;
    host.addEventListener("pointerenter", function () { host.classList.add("hovering"); });
    host.addEventListener("pointermove", function (e) {
      var r = host.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      target.style.setProperty("--ry", (dx * max).toFixed(2) + "deg");
      target.style.setProperty("--rx", (-dy * max).toFixed(2) + "deg");
      target.style.setProperty("--s", scale);
    });
    host.addEventListener("pointerleave", function () {
      host.classList.remove("hovering");
      target.style.removeProperty("--rx"); target.style.removeProperty("--ry"); target.style.removeProperty("--s");
    });
  }
  stickerEls.forEach(function (el) { tilt(el, el.querySelector(".body"), 18, 1.06); });
  var avatarBtn = $("avatar").querySelector("button");
  tilt($("avatar"), $("avatar").querySelector(".body"), 22, 1.08);

  // Click: each sticker plays its own little animation
  function play(host) {
    if (reduceMotion) return;
    host.classList.remove("play");
    void host.offsetWidth; // restart the animation
    host.classList.add("play");
    clearTimeout(host._t);
    host._t = setTimeout(function () { host.classList.remove("play"); }, 1600);
  }
  function runCalculator(host) {
    var screen = host.querySelector(".calc-screen"), keys = host.querySelectorAll(".key");
    if (!screen || reduceMotion) return;
    var target = 2000, start = performance.now(), dur = 900;
    clearInterval(host._k);
    host._k = setInterval(function () {
      keys.forEach(function (k) { k.classList.remove("down"); });
      keys[Math.floor(Math.random() * keys.length)].classList.add("down");
    }, 90);
    (function frame(now) {
      var t = Math.min(1, (now - start) / dur), eased = 1 - Math.pow(1 - t, 3);
      screen.textContent = (target * eased).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (t < 1) requestAnimationFrame(frame);
      else { clearInterval(host._k); keys.forEach(function (k) { k.classList.remove("down"); }); }
    })(start);
  }
  stickerEls.forEach(function (el) {
    el.querySelector("button").addEventListener("click", function () {
      if (el.getAttribute("data-key") === "calc") runCalculator(el);
      else play(el);
    });
  });
  avatarBtn.addEventListener("click", function () { play($("avatar")); });

  // ---------- projects ----------
  var byYear = {};
  S.projects.forEach(function (p) { (byYear[p.year] = byYear[p.year] || []).push(p); });
  var years = Object.keys(byYear).sort(function (a, b) { return b - a; });
  $("project-count").textContent = S.projects.length + (S.projects.length === 1 ? " project" : " projects");

  $("project-list").innerHTML = years.map(function (y) {
    return '<div class="year reveal">' + ART.mini("folder") + "<span>" + y + "</span></div>" + byYear[y].map(function (p) {
      var actions = '<a class="btn primary" href="' + esc(p.page) + '">Project page ' + ARROW_R + "</a>";
      if (p.code) actions += '<a class="btn" href="' + esc(S.repoUrl + "/" + p.code) + '"' + NEW_TAB + ">" + icon("code", "ico-s") + " Code" + NEW_TAB_SR + "</a>";
      if (p.video) actions += '<a class="btn" href="' + esc(p.video) + '"' + NEW_TAB + ">" + icon("play", "ico-s") + " Video" + NEW_TAB_SR + "</a>";
      return '<article class="project reveal">' +
        '<div class="thumb-wrap"><a class="thumb" href="' + esc(p.page) + '" tabindex="-1" aria-hidden="true"><img src="' + esc(p.thumbnail) + '" alt="" width="1280" height="720" loading="lazy" decoding="async"></a></div>' +
        "<div>" +
          '<div class="project-top"><h3><a href="' + esc(p.page) + '">' + esc(p.title) + "</a></h3>" +
          (p.status ? '<span class="badge">' + esc(p.status) + "</span>" : "") + "</div>" +
          "<p>" + esc(p.summary) + "</p>" +
          '<ul class="chips" aria-label="Tools">' + p.tools.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul>" +
          '<div class="actions">' + actions + "</div>" +
        "</div></article>";
    }).join("");
  }).join("");
  document.querySelectorAll(".thumb-wrap").forEach(function (w) { tilt(w, w.querySelector(".thumb"), 10, 1.03); });

  // ---------- about ----------
  (function () {
    var h = new Date().getHours();
    $("about-h").textContent = h < 12 ? "Good morning!" : h < 18 ? "Good afternoon!" : "Good evening!";
    $("greet-left").innerHTML = ART.mini("pie");
    $("greet-right").innerHTML = ART.mini("coffee");
    $("iso").innerHTML = ART.iso();
    $("about-list").innerHTML = (S.about || []).map(function (a) {
      // put the icon right after the bold lead-in, like a little sticker in the sentence
      var html = rich(a.text);
      var icon = ART.mini(a.icon);
      html = html.indexOf("</b>") > -1 ? html.replace("</b>", "</b>" + icon) : icon + html;
      return '<li class="reveal">' + html + "</li>";
    }).join("");
  })();

  // ---------- updates (grouped by month, no day shown) ----------
  var updates = S.updates.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  var groups = [], seen = {};
  updates.forEach(function (u) {
    var k = monthKey(u.date);
    if (!seen[k]) { seen[k] = { key: k, items: [] }; groups.push(seen[k]); }
    seen[k].items.push(u);
  });
  $("update-list").innerHTML = groups.map(function (g) {
    return '<div class="month reveal"><span>' + monthLabel(g.key) + "</span></div>" +
      '<ol class="log">' + g.items.map(function (u) {
        return '<li class="reveal"><span class="what">' + esc(u.text) + "</span>" + (u.project ? '<span class="tag">' + esc(u.project) + "</span>" : "") + "</li>";
      }).join("") + "</ol>";
  }).join("");

  // ---------- skills ----------
  $("skill-list").innerHTML = S.skills.map(function (g, i) {
    return '<div class="skill-row reveal"><div class="label"><b>' + String(i + 1).padStart(2, "0") + "</b>" + esc(g.group) + "</div>" +
      '<ul class="chips">' + g.items.map(function (t) { return '<li class="chip">' + esc(t) + "</li>"; }).join("") + "</ul></div>";
  }).join("");

  // ---------- contact links ----------
  $("link-list").innerHTML = S.links.filter(function (l) { return l.url; }).map(function (l) {
    var ext = isExternal(l.url);
    var row = '<a href="' + esc(l.url) + '"' + (ext ? NEW_TAB : "") + ">" + icon(l.icon) +
      '<span class="txt"><b>' + esc(l.label) + "</b><span>" + esc(l.handle) + "</span></span>" +
      (ext ? NEW_TAB_SR : "") + (l.copy ? "" : ARROW_UR) + "</a>";
    if (l.copy) {
      row += '<button type="button" class="copy" data-copy="' + esc(l.copy) + '" aria-label="Copy ' + esc(l.label.toLowerCase()) + ' address">' +
        icon("copy") + '<span class="tip" aria-hidden="true">Copy ' + esc(l.label.toLowerCase()) + "</span></button>";
    }
    return '<li' + (l.copy ? ' class="has-copy"' : "") + ">" + row + "</li>";
  }).join("");
  document.querySelectorAll(".copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy"), tip = btn.querySelector(".tip");
      var done = function () {
        btn.classList.add("copied");
        btn.innerHTML = icon("check") + '<span class="tip" aria-hidden="true">Copied!</span>';
        btn.setAttribute("aria-label", "Copied");
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.innerHTML = icon("copy") + '<span class="tip" aria-hidden="true">' + tip.textContent + "</span>";
          btn.setAttribute("aria-label", "Copy email address");
        }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

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
  var navLinks = document.querySelectorAll(".topbar nav a, .ticks a");
  var sections = ["top", "projects", "about", "skills", "updates", "contact"].map(function (id) { return $(id); });
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
