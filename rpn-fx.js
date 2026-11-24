/* PT Rantai Pangan Nusantara — nav, tema, background makanan melayang, animasi logo kepala ayam, preloader */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || doc).querySelectorAll(s)); };
  var cv = function (n) { return getComputedStyle(root).getPropertyValue(n).trim(); };
  var rnd = function (a, b) { return a + Math.random() * (b - a); };
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };
  var easeOut = function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); };
  var easeIO = function (t) { t = clamp(t, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var easeBack = function (t) { var c = 1.5; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var ASSET = '/';

  /* ---------- SVG ikon (sayuran, daging, ikan, frozen) ---------- */
  var ICONS = {
    snow: '<path d="M32 6V58M26 12l6 6 6-6M26 52l6-6 6 6"/><path d="M32 6V58M26 12l6 6 6-6M26 52l6-6 6 6" transform="rotate(60 32 32)"/><path d="M32 6V58M26 12l6 6 6-6M26 52l6-6 6 6" transform="rotate(120 32 32)"/>',
    ice: '<path d="M12 22l20-10 20 10v22L32 54 12 44z"/><path d="M12 22l20 10 20-10M32 32v22"/><path d="M20 20l6 3"/>',
    pack: '<path d="M16 10h32l3 6v34a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4V16z"/><path d="M13 16h38M32 26v20M23 36h18M25 29l14 14M39 29L25 43"/>',
    fish: '<path d="M6 32c10-14 26-14 38 0-12 14-28 14-38 0zM44 32l14-10v20z"/><circle cx="18" cy="29" r="1.8"/><path d="M28 24c3 4 3 12 0 16"/>',
    carrot: '<path d="M10 54L38 20l8 8z"/><path d="M40 18c0-6 3-10 8-12M44 22c4-3 9-3 13-1M24 38l6 5M30 30l6 5"/>',
    broc: '<circle cx="22" cy="24" r="9"/><circle cx="34" cy="18" r="10"/><circle cx="44" cy="26" r="9"/><path d="M26 33c0 8-2 14-4 20h20c-2-6-4-12-4-20"/>',
    corn: '<path d="M32 8c10 6 14 22 6 40-3 5-9 5-12 0C18 30 22 14 32 8z"/><path d="M26 22h12M24 32h16M25 42h14M32 10v40"/><path d="M26 50c-6 2-10 0-14-6M38 50c6 2 10 0 14-6"/>',
    leg: '<path d="M44 12c8 2 10 12 4 18-4 4-10 4-14 1L16 49a4 4 0 1 1-5 5 4 4 0 0 1-6-5l-1-1"/><circle cx="46" cy="21" r="7"/>',
    sausage: '<path d="M14 40c-6-6-6-14 0-20s14-6 20 0l16 16c6 6 6 14 0 20s-14 6-20 0z" transform="translate(-4 -8) scale(.95)"/><path d="M22 30l10 10M30 22l10 10"/>'
  };
  var svgCache = {};
  function iconImg(key, color) {
    var id = key + color; if (svgCache[id]) return svgCache[id];
    var im = new Image();
    im.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="256" height="256" fill="none" stroke="' + color + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + ICONS[key] + '</svg>');
    svgCache[id] = im; return im;
  }

  /* ---------- background makanan melayang ---------- */
  var atlas = null, atlasMeta = null, photos = [], foodReady = false, foodQ = [];
  var PHOTO_FILES = ['p-karkas', 'p-dada-utuh', 'p-boneless-dada', 'p-sayap', 'p-paha-utuh', 'p-ati-ampela', 'p-ceker', 'p-paha'];
  (function loadFood() {
    var a = new Image(), pending = 2;
    function done() { if (--pending === 0) { foodReady = true; foodQ.forEach(function (f) { f(); }); } }
    a.onload = function () { atlas = a; done(); }; a.onerror = done; a.src = ASSET + 'img/food-atlas.png';
    fetch(ASSET + 'img/food-atlas.json').then(function (r) { return r.json(); }).then(function (j) { atlasMeta = j; done(); }).catch(done);
    PHOTO_FILES.forEach(function (n) { var p = new Image(); p.src = ASSET + 'img/' + n + '.jpg'; photos.push(p); });
  })();
  var tintCache = {};
  function tinted(idx, color) {
    var k = idx + '|' + color; if (tintCache[k]) return tintCache[k];
    var m = atlasMeta.s[idx], c = doc.createElement('canvas'); c.width = m.w; c.height = m.h;
    var x = c.getContext('2d'); x.drawImage(atlas, m.x, m.y, m.w, m.h, 0, 0, m.w, m.h);
    x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, m.w, m.h);
    tintCache[k] = c; return c;
  }
  function foodColors(tone) { return tone === 'dark' ? ['#1F5FB8', '#4F96E6', '#123D78'] : ['#BFDBFF', '#8DB9F2', '#4F8FE0']; }
  function initFood(host) {
    var c = $('canvas.food', host); if (!c) return;
    var ctx = c.getContext('2d'), dense = host.getAttribute('data-food') === 'hero', tone = host.getAttribute('data-tone') === 'dark' ? 'dark' : 'light';
    var W = 0, H = 0, items = [], raf = 0, visible = true, mx = 0, my = 0, tx = 0, ty = 0, iconKeys = Object.keys(ICONS);
    function build() {
      W = host.clientWidth; H = host.clientHeight; c.width = W * DPR; c.height = H * DPR;
      var base = Math.round(W * H / (dense ? 30000 : 52000)); if (W < 700) base = Math.round(base * .7);
      var cols = foodColors(tone), baseA = tone === 'dark' ? .15 : .26;
      items = [];
      for (var i = 0; i < base; i++) {
        var r = Math.random(), it;
        var depth = rnd(.3, 1.4);
        it = { x: rnd(0, W), y: rnd(0, H), vx: rnd(-.12, .12) * depth, vy: rnd(-.28, -.06) * depth, rot: rnd(0, 6.28), vr: rnd(-.004, .004), ph: rnd(0, 6.28), depth: depth, sz: rnd(46, 112) * (.7 + depth * .35) };
        if (r < .58) { it.t = 's'; it.idx = Math.floor(Math.random() * atlasMeta.s.length); it.col = cols[i % 3]; it.a = baseA * rnd(.9, 1.7); var m = atlasMeta.s[it.idx]; it.w = it.sz * (m.w > m.h ? 1 : m.w / m.h); it.h = it.w * m.h / m.w; }
        else if (r < .86) { it.t = 'i'; it.key = iconKeys[Math.floor(Math.random() * iconKeys.length)]; it.col = cols[(i + 1) % 3]; it.a = baseA * rnd(1.4, 2.4); it.w = it.h = it.sz * .85; }
        else if (W >= 700 && !host.hasAttribute('data-nophoto') && (dense || Math.random() < .4)) { it.t = 'p'; it.p = photos[Math.floor(Math.random() * photos.length)]; it.w = it.h = it.sz * 1.05; it.a = tone === 'dark' ? .55 : .5; it.vr = 0; it.rot = 0; it.col = cols[0]; }
        else { it.t = 's'; it.idx = Math.floor(Math.random() * atlasMeta.s.length); it.col = cols[0]; it.a = baseA * 1.3; var m2 = atlasMeta.s[it.idx]; it.w = it.sz; it.h = it.w * m2.h / m2.w; }
        items.push(it);
      }
    }
    function draw(adv) {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      mx += (tx - mx) * .06; my += (ty - my) * .06;
      var t = performance.now() / 1000;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        if (adv) { it.x += it.vx; it.y += it.vy; it.rot += it.vr; if (it.y < -it.h) { it.y = H + it.h; it.x = rnd(0, W); } if (it.x < -it.w) it.x = W + it.w; if (it.x > W + it.w) it.x = -it.w; }
        var px = it.x + mx * it.depth * 26 + Math.sin(t * .6 + it.ph) * 8, py = it.y + my * it.depth * 20 + Math.cos(t * .5 + it.ph) * 6;
        var fade = (dense && W > 940) ? .28 + .72 * clamp((px / W - .32) / .3, 0, 1) : 1;
        if (dense) fade *= clamp((py - 70) / 90, 0, 1);
        if (W > 940 && px / W > .6 && py / H > .66) fade *= .22;
        ctx.save(); ctx.globalAlpha = it.a * fade; ctx.translate(px, py); ctx.rotate(it.rot + Math.sin(t * .4 + it.ph) * .12);
        if (it.t === 's') ctx.drawImage(tinted(it.idx, it.col), -it.w / 2, -it.h / 2, it.w, it.h);
        else if (it.t === 'i') { var im = iconImg(it.key, it.col); if (im.complete && im.naturalWidth) ctx.drawImage(im, -it.w / 2, -it.h / 2, it.w, it.h); }
        else if (it.p && it.p.complete && it.p.naturalWidth) {
          var r = it.w / 2; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.save(); ctx.clip();
          var s = Math.max(it.w / it.p.naturalWidth, it.h / it.p.naturalHeight), dw = it.p.naturalWidth * s, dh = it.p.naturalHeight * s;
          ctx.drawImage(it.p, -dw / 2, -dh / 2, dw, dh); ctx.restore();
          ctx.lineWidth = 2; ctx.strokeStyle = it.col; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
        }
        ctx.restore();
      }
    }
    function loop() { if (!visible || doc.hidden) { raf = 0; return; } draw(true); raf = requestAnimationFrame(loop); }
    function start() { build(); if (reduce) { draw(false); return; } if (!raf) raf = requestAnimationFrame(loop); }
    if (host.hasAttribute('data-global')) window.addEventListener('pointermove', function (e) { tx = (e.clientX / window.innerWidth - .5) * 2; ty = (e.clientY / window.innerHeight - .5) * 2; });
    else host.addEventListener('pointermove', function (e) { var r = host.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .5) * 2; });
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && !raf && !reduce) raf = requestAnimationFrame(loop); }).observe(host);
    var rz; addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { if (!reduce) { build(); } else { build(); draw(false); } }, 200); });
    doc.addEventListener('rpn-theme', function () { tintCache = {}; svgCache = {}; build(); if (reduce) draw(false); });
    doc.addEventListener('visibilitychange', function () { if (!doc.hidden && !raf && visible && !reduce) raf = requestAnimationFrame(loop); });
    start();
  }
  function bootFood() { $$('[data-food]').forEach(initFood); }
  if (foodReady) bootFood(); else foodQ.push(bootFood);
  setTimeout(function () { if (!foodReady) { foodReady = true; if (atlas && atlasMeta) bootFood(); } }, 4000);

  /* ---------- animasi logo kepala ayam: potongan makanan terbang & menyatu ---------- */
  var markImg = new Image(), pieces = null, LW = 0, LH = 0, markCbs = [];
  var SC = .8, PAD = 36;
  function labelPieces(img) {
    var W = img.naturalWidth, H = img.naturalHeight, off = doc.createElement('canvas'); off.width = W; off.height = H;
    var o = off.getContext('2d'); o.drawImage(img, 0, 0); var d = o.getImageData(0, 0, W, H).data;
    var lab = new Int32Array(W * H), comps = [], n = 0, st = [];
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
      var i0 = y * W + x; if (lab[i0] || d[i0 * 4 + 3] < 60) continue;
      n++; var c = { px: [], x0: x, x1: x, y0: y, y1: y }; st.length = 0; st.push(i0); lab[i0] = n;
      while (st.length) {
        var p = st.pop(), px = p % W, py = (p / W) | 0; c.px.push(p);
        if (px < c.x0) c.x0 = px; if (px > c.x1) c.x1 = px; if (py < c.y0) c.y0 = py; if (py > c.y1) c.y1 = py;
        for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
          var nx = px + dx, ny = py + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
          var ni = ny * W + nx; if (!lab[ni] && d[ni * 4 + 3] >= 60) { lab[ni] = n; st.push(ni); }
        }
      }
      comps.push(c);
    }
    return comps.map(function (c) {
      var bw = c.x1 - c.x0 + 1, bh = c.y1 - c.y0 + 1, cvs = doc.createElement('canvas'); cvs.width = bw; cvs.height = bh;
      var cx = cvs.getContext('2d'), im = cx.createImageData(bw, bh);
      for (var i = 0; i < c.px.length; i++) { var p = c.px[i], px = p % W - c.x0, py = ((p / W) | 0) - c.y0, o2 = (py * bw + px) * 4; im.data[o2] = im.data[o2 + 1] = im.data[o2 + 2] = 255; im.data[o2 + 3] = d[p * 4 + 3]; }
      cx.putImageData(im, 0, 0);
      return { base: cvs, w: bw * SC, h: bh * SC, fx: (c.x0 + bw / 2) * SC + PAD, fy: (c.y0 + bh / 2) * SC + PAD, cy: (c.y0 + bh / 2) / H, cx: (c.x0 + bw / 2) / W, tints: {} };
    });
  }
  markImg.onload = function () {
    LW = Math.round(markImg.naturalWidth * SC + 2 * PAD); LH = Math.round(markImg.naturalHeight * SC + 2 * PAD);
    pieces = labelPieces(markImg); pieces.forEach(function (p, i) {
      var a = rnd(0, 6.283), d = rnd(260, 520); p.sx = p.fx + Math.cos(a) * d; p.sy = p.fy + Math.sin(a) * d; p.rot = rnd(-3, 3); p.s0 = rnd(.2, 1.5);
      p.delay = (p.cy * .5 + Math.random() * .5) * 1400; p.dur = rnd(850, 1500); p.ph = rnd(0, 6.28);
    });
    markCbs.forEach(function (f) { f(); });
  };
  markImg.src = ASSET + 'img/mark.png';
  function onMark(f) { if (pieces) f(); else markCbs.push(f); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function hex(h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function gradColor(cy, light) { var a = hex(light ? '#EAF2FF' : cv('--g1')), b = hex(light ? '#BFDBFF' : cv('--g2')), c = hex(light ? '#8DB9F2' : cv('--g3')), t = cy < .5 ? cy * 2 : (cy - .5) * 2, f = cy < .5 ? [a, b] : [b, c]; return 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(mix(f[0][i], f[1][i], t)); }).join(',') + ')'; }
  function tintPiece(p, light) {
    var col = gradColor(p.cy, light), k = col; if (p.tints[k]) return p.tints[k];
    var c = doc.createElement('canvas'); c.width = p.base.width; c.height = p.base.height; var x = c.getContext('2d');
    x.drawImage(p.base, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); p.tints[k] = c; return c;
  }
  window.__logoReady = false; window.__logoProgress = 0;
  function initLogo(canvas, mode) {
    var live = canvas.parentNode; live.style.setProperty('--lr', (LW / LH).toFixed(4));
    canvas.width = LW * DPR; canvas.height = LH * DPR; var ctx = canvas.getContext('2d');
    var isPre = mode === 'pre', t0 = performance.now(), landedAll = false, light = !!canvas.closest('[data-logo-light]');
    var PRE_TOTAL = 3000, CYCLE = 11000;
    doc.addEventListener('rpn-theme', function () { pieces.forEach(function (p) { p.tints = {}; }); });
    function render(now) {
      var t = now - t0; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, LW, LH);
      var assembleK = null, explode = 0, shine = -1, breathe = 1, ph = now / 1000;
      if (isPre) {
        var landed = 0;
        for (var i = 0; i < pieces.length; i++) if (t >= pieces[i].delay + pieces[i].dur) landed++;
        window.__logoProgress = Math.max(landed / pieces.length, 0) * .92 + (t > 2000 ? clamp((t - 2000) / 900, 0, 1) * .08 : 0);
        if (landed === pieces.length) { shine = clamp((t - (maxLand() + 80)) / 700, 0, 1.2); if (!window.__logoReady && shine > 1.0) window.__logoReady = true; }
      } else {
        var u = (t % CYCLE) / CYCLE; shine = (u > .06 && u < .20) ? (u - .06) / .14 : -1;
        if (u >= .56 && u < .70) explode = easeIO((u - .56) / .14);
        else if (u >= .70 && u < .96) { assembleK = (u - .70) / .26; }
      }
      for (var j = 0; j < pieces.length; j++) {
        var p = pieces[j], x = p.fx, y = p.fy, rot = 0, sc = 1, al = 1;
        if (isPre) {
          var k = clamp((t - p.delay) / p.dur, 0, 1); if (k <= 0) continue;
          var e = easeOut(k); x = p.sx + (p.fx - p.sx) * e; y = p.sy + (p.fy - p.sy) * e; rot = p.rot * (1 - e); sc = p.s0 + (1 - p.s0) * easeBack(Math.min(1, k)); al = clamp(k * 4, 0, 1);
        } else if (explode > 0) {
          x = p.fx + (p.sx - p.fx) * explode; y = p.fy + (p.sy - p.fy) * explode; rot = p.rot * explode; sc = 1 - .5 * explode; al = 1 - explode;
        } else if (assembleK !== null) {
          var kk = clamp((assembleK * 1400 - p.delay * .45) / (p.dur * .55), 0, 1); if (kk <= 0) continue;
          var e2 = easeOut(kk); x = p.sx + (p.fx - p.sx) * e2; y = p.sy + (p.fy - p.sy) * e2; rot = p.rot * (1 - e2); sc = p.s0 + (1 - p.s0) * easeBack(Math.min(1, kk)); al = clamp(kk * 4, 0, 1);
        } else { x += Math.sin(ph * 1.1 + p.ph) * 1.6; y += Math.cos(ph * .9 + p.ph) * 1.6; rot = Math.sin(ph * .8 + p.ph) * .012; }
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha = al;
        ctx.drawImage(tintPiece(p, light), -p.w / 2, -p.h / 2, p.w, p.h);
        if (shine >= 0 && shine <= 1.2) { var pr = (p.cx * .6 + p.cy * .4), b = clamp(1 - Math.abs(pr - (shine * 1.3 - .15)) / .13, 0, 1); if (b > 0) { ctx.globalAlpha = al * b * .9; ctx.drawImage(p.base, -p.w / 2, -p.h / 2, p.w, p.h); } }
        ctx.restore();
      }
    }
    var landMax = 0; function maxLand() { if (!landMax) pieces.forEach(function (p) { landMax = Math.max(landMax, p.delay + p.dur); }); return landMax; }
    if (reduce) { t0 = performance.now() - 10000; assembleStatic(); return; }
    function assembleStatic() { isPre = false; CYCLE = 1e9; t0 = performance.now(); render(performance.now()); window.__logoReady = true; window.__logoProgress = 1; }
    (function loop(now) {
      if (!isPre && doc.getElementById('preloader') && !doc.documentElement.classList.contains('skip-loader')) { requestAnimationFrame(loop); return; }
      if (isPre && !doc.getElementById('preloader')) return;
      if (!isPre && !canvas.__started) { canvas.__started = true; t0 = now; }
      render(now); requestAnimationFrame(loop);
    })(performance.now());
  }
  function bootLogo() {
    var cs = $$('.logo-canvas'); if (!cs.length) { window.__logoReady = true; return; }
    onMark(function () { cs.forEach(function (c) { initLogo(c, c.closest('#preloader') ? 'pre' : 'hero'); }); });
  }
  markImg.onerror = function () { window.__logoReady = true; };
  bootLogo();
  setTimeout(function () { window.__logoReady = true; }, 7000);

  /* ---------- preloader ---------- */
  (function () {
    var pl = $('#preloader'); if (!pl) return;
    if (root.classList.contains('skip-loader')) { pl.remove(); root.classList.add('is-ready'); return; }
    root.style.overflow = 'hidden';
    var MIN = reduce ? 300 : 700, start = performance.now(), bar = $('.pl-bar i'), stop = false;
    (function tick() { if (stop || !bar) return; bar.style.width = ((window.__logoReady ? 1 : window.__logoProgress || 0) * 100) + '%'; requestAnimationFrame(tick); })();
    function reveal() { stop = true; if (bar) bar.style.width = '100%'; pl.classList.add('done'); root.style.overflow = ''; root.classList.add('is-ready'); setTimeout(function () { pl.remove(); }, 600); }
    function finish() { var w = Math.max(0, MIN - (performance.now() - start)); setTimeout(function poll() { if (window.__logoReady) reveal(); else setTimeout(poll, 100); }, w); }
    if (doc.readyState === 'complete') finish(); else addEventListener('load', finish, { once: true });
  })();
  if (!$('#preloader')) root.classList.add('is-ready');

})();
