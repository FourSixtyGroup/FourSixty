(function () {
  var body = document.body;
  var intro = document.getElementById('intro');

  // Opening (welcome) screen - home page, first visit of the session only
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
