(function () {
  var body = document.body;
  var loader = document.getElementById('loader');
  var intro = document.getElementById('intro');

  // Loading + opening screens (home page, first visit of the session only)
  var seen = false;
  try { seen = sessionStorage.getItem('fs-seen') === '1'; } catch (e) {}
  if (loader && intro) {
    if (seen) {
      loader.remove(); intro.remove(); body.classList.remove('locked');
    } else {
      var fill = document.getElementById('barFill');
      var pct = document.getElementById('pct');
      var progress = 0, loaded = false;
      var setProgress = function (v) {
        progress = v;
        fill.style.width = v + '%';
        pct.textContent = Math.round(v) + '%';
      };
      var tick = setInterval(function () {
        if (!loaded && progress < 90) setProgress(progress + (90 - progress) * 0.08 + 0.4);
      }, 80);
      var finishLoading = function () {
        loaded = true; clearInterval(tick); setProgress(100);
        setTimeout(function () {
          loader.classList.add('out');
          intro.hidden = false;
          setTimeout(enterSite, 5200);
          setTimeout(function () { loader.remove(); }, 800);
        }, 500);
      };
      if (document.readyState === 'complete') finishLoading();
      else window.addEventListener('load', finishLoading);
      var enterSite = function () {
        try { sessionStorage.setItem('fs-seen', '1'); } catch (e) {}
        intro.classList.add('out');
        body.classList.remove('locked');
        setTimeout(function () { intro.remove(); }, 800);
      };
    }
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
