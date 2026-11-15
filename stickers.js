// Sticker illustrations, drawn as inline SVG so they stay sharp and load instantly.
// Each function returns an <svg> string. The white die-cut border comes from the
// shared #stk / #stk-sm filters in STICKER_DEFS.
(function () {
  "use strict";
  var INK = "#161616", PAPER = "#fbfaf7", CREAM = "#efe9dc", BLUE = "#2f6bff", BLUE_LT = "#9ab8ff",
      GOLD = "#f5c542", GREEN = "#3ddc84", DARK = "#1d2028", DARK2 = "#2a2e38";

  var DEFS =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
      '<filter id="stk" x="-15%" y="-15%" width="130%" height="130%">' +
        '<feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d"/>' +
        '<feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      "</filter>" +
      '<filter id="stk-sm" x="-20%" y="-20%" width="140%" height="140%">' +
        '<feMorphology in="SourceAlpha" operator="dilate" radius="1.6" result="d"/>' +
        '<feFlood flood-color="#ffffff"/><feComposite in2="d" operator="in" result="b"/>' +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      "</filter>" +
      '<pattern id="ht" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.15" fill="#161616" opacity=".28"/></pattern>' +
      '<pattern id="ht-lt" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.1" fill="#ffffff" opacity=".18"/></pattern>' +
    "</defs></svg>";

  function svg(vb, body, cls) {
    return '<svg viewBox="' + vb + '" class="' + (cls || "") + '" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  // ---------- Spreadsheet ----------
  function sheet() {
    var b = "";
    // yellow tab behind the page
    b += '<rect x="226" y="66" width="30" height="34" rx="5" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="3"/>';
    // page
    b += '<rect x="8" y="12" width="236" height="172" rx="9" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';
    // formula bar
    b += '<path d="M8 21a9 9 0 0 1 9-9h218a9 9 0 0 1 9 9v21H8z" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<text x="20" y="33" font-family="Georgia,serif" font-style="italic" font-size="13" fill="#fff">fx</text>';
    b += '<text x="42" y="32" font-family="ui-monospace,Menlo,monospace" font-size="10.5" fill="#fff">=NPV(rate, cash_flows)</text>';
    // header row + row labels
    b += '<rect x="9.5" y="43.5" width="233" height="15" fill="' + CREAM + '"/>';
    b += '<rect x="9.5" y="58" width="30" height="124" fill="' + CREAM + '"/>';
    var cols = [40, 91, 142, 193], letters = "ABCD";
    cols.forEach(function (x, i) {
      b += '<text x="' + (x + 25.5) + '" y="55" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="' + INK + '" opacity=".7">' + letters[i] + "</text>";
    });
    for (var r = 0; r < 6; r++) {
      b += '<text x="25" y="' + (72 + r * 21) + '" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="9.5" fill="' + INK + '" opacity=".7">' + (r + 1) + "</text>";
    }
    // grid lines
    var g = "";
    [40, 91, 142, 193].forEach(function (x) { g += '<path d="M' + x + ' 43v140"/>'; });
    for (var y = 58; y <= 163; y += 21) g += '<path d="M9 ' + y + 'h234"/>';
    b += '<g stroke="' + INK + '" stroke-width="1.2" opacity=".32">' + g + "</g>";
    // cell values as little bars (they fill in when clicked)
    var widths = [[30, 22, 34, 26], [26, 34, 20, 30], [34, 18, 28, 36], [22, 30, 36, 24], [30, 26, 22, 32], [36, 32, 30, 38]];
    var k = 0;
    widths.forEach(function (row, ri) {
      row.forEach(function (w, ci) {
        var x = cols[ci] + 51 - 6 - w, yy = 58 + ri * 21 + 8;
        var fill = ri === 5 ? BLUE : ci === 3 ? "#7d7d7d" : "#b9b3a6";
        b += '<rect class="cell-bar" style="--i:' + k++ + '" x="' + x + '" y="' + yy + '" width="' + w + '" height="5" rx="2.5" fill="' + fill + '"/>';
      });
    });
    // total row underline + selected cell
    b += '<path d="M40 163h203" stroke="' + INK + '" stroke-width="2"/>';
    b += '<rect class="sel" x="142" y="121" width="51" height="21" fill="none" stroke="' + BLUE + '" stroke-width="3"/>';
    b += '<rect class="sel" x="189" y="138" width="7" height="7" fill="' + BLUE + '" stroke="#fff" stroke-width="1.5"/>';
    // halftone shade on the left edge
    b += '<rect x="9.5" y="43.5" width="30" height="139" fill="url(#ht)"/>';
    return svg("0 0 262 196", '<g filter="url(#stk)">' + b + "</g>", "art art-sheet");
  }

  // ---------- Chart dashboard ----------
  function dash() {
    var b = "";
    b += '<rect x="8" y="8" width="424" height="174" rx="16" fill="' + DARK + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<path d="M8 24a16 16 0 0 1 16-16h392a16 16 0 0 1 16 16v14H8z" fill="' + DARK2 + '"/>';
    b += '<path d="M8 38h424" stroke="' + INK + '" stroke-width="2"/>';
    b += '<circle cx="28" cy="23" r="5" fill="#ff6b6b"/><circle cx="44" cy="23" r="5" fill="' + GOLD + '"/><circle cx="60" cy="23" r="5" fill="' + GREEN + '"/>';
    b += '<rect x="80" y="14" width="96" height="18" rx="6" fill="' + DARK + '"/>';
    b += '<text x="90" y="27" font-family="ui-monospace,Menlo,monospace" font-size="10.5" fill="#c9ccd3">model.ipynb</text>';
    // grid
    var g = "";
    for (var gy = 64; gy <= 160; gy += 24) g += '<path d="M24 ' + gy + 'h268"/>';
    b += '<g stroke="#3a3f4b" stroke-width="1" stroke-dasharray="3 4">' + g + "</g>";
    // candles
    var closes = [40, 47, 43, 52, 48, 58, 55, 64, 60, 69, 66, 76, 72, 83];
    var open = 36, ma = [];
    var candles = "";
    closes.forEach(function (c, i) {
      var x = 34 + i * 18.5, hi = Math.max(open, c) + 5, lo = Math.min(open, c) - 5;
      var Y = function (v) { return 168 - (v - 30) * 2.05; };
      var up = c >= open;
      candles += '<g class="candle" style="--i:' + i + '">' +
        '<path d="M' + (x + 5) + " " + Y(hi) + "V" + Y(lo) + '" stroke="' + (up ? BLUE_LT : CREAM) + '" stroke-width="2"/>' +
        '<rect x="' + x + '" y="' + Y(Math.max(open, c)) + '" width="11" height="' + Math.max(4, Math.abs(c - open) * 2.05) + '" rx="2" fill="' + (up ? BLUE : CREAM) + '" stroke="' + INK + '" stroke-width="1.5"/></g>';
      ma.push([x + 5, Y((open + c) / 2)]);
      open = c;
    });
    b += candles;
    b += '<path class="ma" pathLength="1" d="M' + ma.map(function (p) { return p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" L") + '" fill="none" stroke="' + GOLD + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    // KPI panel
    var kpi = [[52, BLUE, 62], [96, GREEN, 48], [140, CREAM, 0]];
    kpi.forEach(function (k) {
      b += '<rect x="304" y="' + k[0] + '" width="114" height="36" rx="8" fill="' + DARK2 + '" stroke="#3a3f4b" stroke-width="1.5"/>';
      b += '<rect x="314" y="' + (k[0] + 9) + '" width="38" height="5" rx="2.5" fill="#6b7180"/>';
      if (k[2]) b += '<rect class="kpi" x="314" y="' + (k[0] + 19) + '" width="' + k[2] + '" height="9" rx="3" fill="' + k[1] + '"/>';
      else b += '<path d="M314 ' + (k[0] + 28) + " l12 -6 l10 3 l12 -9 l12 4 l14 -10 l14 2" + '" fill="none" stroke="' + GOLD + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
    });
    b += '<rect x="8" y="140" width="424" height="42" rx="0" fill="url(#ht-lt)" opacity=".7"/>';
    return svg("0 0 440 190", '<g filter="url(#stk)">' + b + "</g>", "art art-dash");
  }

  // ---------- Calculator ----------
  function calc() {
    var b = "";
    b += '<rect x="10" y="8" width="130" height="186" rx="18" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<rect x="10" y="120" width="130" height="74" rx="0" fill="url(#ht)" opacity=".5"/>';
    b += '<rect x="22" y="20" width="106" height="44" rx="7" fill="#cfdcc3" stroke="' + INK + '" stroke-width="2.5"/>';
    b += '<text class="calc-screen" x="120" y="49" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="17" font-weight="600" fill="#1f2a1c">2,000.00</text>';
    b += '<text x="28" y="33" font-family="ui-monospace,Menlo,monospace" font-size="7.5" fill="#1f2a1c" opacity=".6">NPV</text>';
    var xs = [22, 49, 76, 103], ys = [76, 99, 122, 145, 168];
    ys.forEach(function (y, ri) {
      xs.forEach(function (x, ci) {
        if (ri === 4 && ci === 3) return;
        var tall = ri === 3 && ci === 3;
        var fill = ci === 3 ? BLUE : (ri === 0 ? "#d9d2c3" : PAPER);
        b += '<rect class="key" x="' + x + '" y="' + y + '" width="24" height="' + (tall ? 41 : 18) + '" rx="5" fill="' + fill + '" stroke="' + INK + '" stroke-width="2"/>';
      });
    });
    return svg("0 0 150 202", '<g filter="url(#stk)">' + b + "</g>", "art art-calc");
  }

  // ---------- Coffee ----------
  function coffee() {
    var b = "";
    b += '<g class="steam" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0">' +
      '<path d="M58 30c-8-8 8-14 0-24"/><path d="M80 28c-8-8 8-14 0-24"/><path d="M102 30c-8-8 8-14 0-24"/></g>';
    b += '<g filter="url(#stk)">';
    b += '<ellipse cx="82" cy="122" rx="72" ry="14" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<ellipse cx="82" cy="119" rx="44" ry="7" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="2"/>';
    b += '<path d="M128 58c30-2 32 40 0 40" fill="none" stroke="' + INK + '" stroke-width="15" stroke-linecap="round"/>';
    b += '<path d="M128 58c30-2 32 40 0 40" fill="none" stroke="' + PAPER + '" stroke-width="8" stroke-linecap="round"/>';
    b += '<path d="M32 44h100v52c0 20-14 24-26 24H58c-12 0-26-4-26-24z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<path d="M33.5 72h97v12h-97z" fill="' + BLUE + '"/>';
    b += '<path d="M33.5 46h30v72c-20-2-30-8-30-22z" fill="url(#ht)"/>';
    b += '<ellipse cx="82" cy="44" rx="50" ry="10" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<ellipse cx="82" cy="45" rx="42" ry="6.5" fill="#4a2c1d"/>';
    b += "</g>";
    return svg("0 0 170 142", b, "art art-coffee");
  }

  // ---------- Poker chip ----------
  function chip() {
    var b = '<g filter="url(#stk)">';
    b += '<circle cx="55" cy="55" r="46" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="3"/>';
    for (var i = 0; i < 8; i++) {
      b += '<rect x="49" y="11" width="12" height="16" rx="3" fill="' + PAPER + '" transform="rotate(' + i * 45 + ' 55 55)"/>';
    }
    b += '<circle cx="55" cy="55" r="29" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="2.5"/>';
    b += '<circle cx="55" cy="55" r="23" fill="none" stroke="' + BLUE + '" stroke-width="2" stroke-dasharray="4 4"/>';
    b += '<text x="55" y="64" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="25" fill="' + INK + '">$</text>';
    b += "</g>";
    return svg("0 0 110 110", b, "art art-chip");
  }

  // ---------- Profile badge ----------
  function avatar() {
    var b = '<g filter="url(#stk)">';
    b += '<circle cx="50" cy="50" r="42" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="3"/>';
    b += '<circle cx="50" cy="50" r="42" fill="url(#ht)" opacity=".45"/>';
    b += '<text x="50" y="57" text-anchor="middle" font-family="Instrument Serif,Georgia,serif" font-style="italic" font-size="34" fill="' + INK + '">DR</text>';
    b += '<path d="M28 70l9-5 7 3 9-8 8 4 11-9" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
    b += "</g>";
    return svg("0 0 100 100", b, "art art-avatar");
  }

  // ---------- Isometric bar chart (margin decoration) ----------
  function iso() {
    function bar(x, h, top, left, right, i) {
      // x = base front-corner x, base y = 150
      var y = 150, w = 26, d = 15;
      return '<g class="iso-bar" style="--i:' + i + '">' +
        '<path d="M' + x + " " + y + "l" + -w + " " + -d + "v" + -h + "l" + w + " " + d + 'z" fill="' + left + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M' + x + " " + y + "l" + w + " " + -d + "v" + -h + "l" + -w + " " + d + 'z" fill="' + right + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M' + x + " " + (y - h) + "l" + -w + " " + -d + "l" + w + " " + -d + "l" + w + " " + d + 'z" fill="' + top + '" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"/></g>';
    }
    var b = '<g filter="url(#stk)">';
    b += '<path d="M14 150l90 52l90-52l-90-52z" fill="#2a2e38" stroke="' + INK + '" stroke-width="2.5" stroke-linejoin="round"/>';
    b += '<path d="M14 150l90 52l90-52l-90-52z" fill="url(#ht-lt)"/>';
    b += bar(62, 26, "#d9e4ff", "#9ab8ff", "#6f96f5", 0);
    b += bar(104, 50, "#d9e4ff", "#6f96f5", "#2f6bff", 1);
    b += bar(146, 82, "#fff3c9", GOLD, "#d9a420", 2);
    b += "</g>";
    return svg("0 0 210 210", b, "art art-iso");
  }

  // ---------- Small icons for the "about" list ----------
  var MINI = {
    chart: '<rect x="4" y="16" width="6" height="11" rx="1.5" fill="' + BLUE_LT + '" stroke="' + INK + '" stroke-width="1.6"/><rect x="13" y="10" width="6" height="17" rx="1.5" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="1.6"/><rect x="22" y="4" width="6" height="23" rx="1.5" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="1.6"/><path d="M2 28h28" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round"/>',
    sheet: '<rect x="3" y="4" width="26" height="24" rx="3" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.6"/><path d="M3 10h26M3 16h26M3 22h26M11 4v24M20 4v24" stroke="' + INK + '" stroke-width="1" opacity=".45"/><rect x="11" y="16" width="9" height="6" fill="none" stroke="' + BLUE + '" stroke-width="1.8"/>',
    receipt: '<path d="M7 3h18v25l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M11 9h10M11 13h10M11 17h6" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="round" opacity=".55"/><circle cx="21" cy="20" r="3.4" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="1.3"/>',
    key: '<circle cx="10" cy="11" r="7" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="1.6"/><circle cx="10" cy="11" r="2.6" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.3"/><path d="M15 16l12 12M22 23l3-3M25 26l2.5-2.5" stroke="' + INK + '" stroke-width="3.6" stroke-linecap="round"/><path d="M15 16l12 12M22 23l3-3M25 26l2.5-2.5" stroke="' + GOLD + '" stroke-width="1.6" stroke-linecap="round"/>',
    chip: '<circle cx="16" cy="16" r="13" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="1.6"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5M6.8 6.8l3.5 3.5M21.7 21.7l3.5 3.5M6.8 25.2l3.5-3.5M21.7 10.3l3.5-3.5" stroke="' + PAPER + '" stroke-width="2.6"/><circle cx="16" cy="16" r="7.5" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.4"/>',
    code: '<rect x="2" y="5" width="28" height="22" rx="4" fill="' + DARK + '" stroke="' + INK + '" stroke-width="1.6"/><path d="M2 10h28" stroke="#3a3f4b" stroke-width="1.5"/><path d="M11 15l-4 4 4 4M21 15l4 4-4 4M18 13.5l-4 11" fill="none" stroke="' + BLUE_LT + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    calc: '<rect x="6" y="2" width="20" height="28" rx="4" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="1.6"/><rect x="9" y="5" width="14" height="6" rx="1.5" fill="#cfdcc3" stroke="' + INK + '" stroke-width="1.2"/><path d="M10 15h3M15 15h3M10 20h3M15 20h3M10 25h3M15 25h3" stroke="' + INK + '" stroke-width="2.2" stroke-linecap="round"/><rect x="20" y="14" width="3" height="13" rx="1.5" fill="' + BLUE + '"/>',
    coffee: '<path d="M5 10h18v11c0 4-3 6-6 6h-6c-3 0-6-2-6-6z" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.6"/><path d="M23 13c5 0 5 8 0 8" fill="none" stroke="' + INK + '" stroke-width="1.6"/><path d="M6 16h16v3H6z" fill="' + BLUE + '"/><ellipse cx="14" cy="10" rx="9" ry="2.2" fill="#4a2c1d" stroke="' + INK + '" stroke-width="1.3"/>',
    pie: '<circle cx="16" cy="16" r="13" fill="' + PAPER + '" stroke="' + INK + '" stroke-width="1.6"/><path d="M16 16V3a13 13 0 0 1 12.4 9z" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/><path d="M16 16l12.4-4A13 13 0 0 1 22 27.4z" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="1.4" stroke-linejoin="round"/>',
    folder: '<path d="M3 9a3 3 0 0 1 3-3h7l3 3h10a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="1.6" stroke-linejoin="round"/><path d="M3 13h26" stroke="' + INK + '" stroke-width="1.4" opacity=".5"/>'
  };
  function mini(name, cls) {
    return svg("0 0 32 32", '<g filter="url(#stk-sm)">' + (MINI[name] || MINI.chart) + "</g>", "mini " + (cls || ""));
  }

  window.STICKERS = { DEFS: DEFS, sheet: sheet, dash: dash, calc: calc, coffee: coffee, chip: chip, avatar: avatar, iso: iso, mini: mini };
})();
