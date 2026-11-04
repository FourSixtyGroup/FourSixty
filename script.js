(function () {
  var body = document.body;
  var intro = document.getElementById('intro');

  // Opening (welcome) screen - first visit of the session only
  var seen = false;
  try { seen = sessionStorage.getItem('fs-seen') === '1'; } catch (e) {}
  if (intro) {
    if (seen) {
      intro.remove(); body.classList.remove('locked');
    } else {
      setTimeout(function () {
        try { sessionStorage.setItem('fs-seen', '1'); } catch (e) {}
        intro.classList.add('out');
        body.classList.remove('locked');
        setTimeout(function () { intro.remove(); }, 800);
      }, 5200);
    }
  }

  // Colour themes (saved in this browser)
  var themes = [['classic', 'Classic'], ['matrix', 'Matrix'], ['sunset', 'Sunset']];
  var themeBtn = document.createElement('button');
  themeBtn.id = 'themeBtn';
  themeBtn.type = 'button';
  themeBtn.setAttribute('aria-label', 'Change colour theme');
  var current = 0;
  try {
    var saved = localStorage.getItem('fs-theme');
    themes.forEach(function (t, i) { if (t[0] === saved) current = i; });
  } catch (e) {}
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', themes[current][0]);
    themeBtn.textContent = 'Theme: ' + themes[current][1];
  }
  themeBtn.addEventListener('click', function () {
    current = (current + 1) % themes.length;
    applyTheme();
    try { localStorage.setItem('fs-theme', themes[current][0]); } catch (e) {}
  });
  applyTheme();
  body.appendChild(themeBtn);

  // Liquid interface: drifting blobs, glass highlights, ripples, gooey cursor droplets
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var liquid = document.createElement('div');
  liquid.className = 'liquid';
  liquid.setAttribute('aria-hidden', 'true');
  liquid.innerHTML = '<i></i><i></i><i></i>';
  body.insertBefore(liquid, body.firstChild);

  var glassSel = 'header, .grid article, .grid .card, .pkg, details, .steps li, .btn.ghost, #themeBtn';
  document.addEventListener('pointermove', function (e) {
    var el = e.target.closest ? e.target.closest(glassSel) : null;
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.btn') : null;
    if (!b) return;
    var r = b.getBoundingClientRect();
    var size = Math.max(r.width, r.height) * 2;
    var s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - r.left - size / 2) + 'px;top:' + (e.clientY - r.top - size / 2) + 'px';
    b.appendChild(s);
    setTimeout(function () { s.remove(); }, 700);
  });

  if (finePointer && !reduceMotion) {
    var svgNS = 'http://www.w3.org/2000/svg';
    var defs = document.createElementNS(svgNS, 'svg');
    defs.setAttribute('width', '0'); defs.setAttribute('height', '0');
    defs.setAttribute('style', 'position:absolute');
    defs.innerHTML = '<defs><filter id="gooF"><feGaussianBlur in="SourceGraphic" stdDeviation="10" result="b"/>' +
      '<feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"/></filter></defs>';
    body.appendChild(defs);
    var goo = document.createElement('div');
    goo.className = 'goo';
    goo.setAttribute('aria-hidden', 'true');
    var sizes = [64, 48, 34, 22], lags = [0.22, 0.15, 0.1, 0.065], drops = [];
    sizes.forEach(function (sz) {
      var d = document.createElement('b');
      d.style.width = d.style.height = sz + 'px';
      d.x = -200; d.y = -200;
      goo.appendChild(d); drops.push(d);
    });
    body.insertBefore(goo, body.firstChild);
    var tx = -200, ty = -200;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY; goo.classList.add('on');
    }, { passive: true });
    document.addEventListener('mouseleave', function () { goo.classList.remove('on'); });
    (function loop() {
      var px = tx, py = ty;
      drops.forEach(function (d, i) {
        d.x += (px - d.x) * lags[i];
        d.y += (py - d.y) * lags[i];
        d.style.transform = 'translate3d(' + (d.x - sizes[i] / 2) + 'px,' + (d.y - sizes[i] / 2) + 'px,0)';
        px = d.x; py = d.y;
      });
      requestAnimationFrame(loop);
    })();
  }

  // Mobile menu
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Scroll progress bar
  var bar = document.getElementById('progress');
  window.addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  // Packages: open one at a time
  document.querySelectorAll('.pkg').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) document.querySelectorAll('.pkg[open]').forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
