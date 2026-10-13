// INTRO: blank page -> pieces of my City Collection photos slap on, faster and faster
// -> a full wall -> then my six stickers slap on top.
(function () {
  const home = document.querySelector('.home');
  const photos = [];
  for (let n = 1; n <= 20; n++) photos.push('images/collection/c' + String(n).padStart(2, '0') + '.jpg');
  photos.push('images/sticker-wall.jpg');

  const COUNT = 150;          // how many scraps
  const TIME = 2600;         // ms until the wall is full
  home.classList.add('building');
  const layer = document.createElement('div'); layer.className = 'scraps';
  const shade = document.createElement('div'); shade.className = 'shade';
  home.prepend(shade); home.prepend(layer);

  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement('div');
    s.className = 'scrap';
    const w = 110 + Math.random() * 190, h = 90 + Math.random() * 170;
    s.style.width = w + 'px'; s.style.height = h + 'px';
    s.style.left = (Math.random() * 105 - 5) + '%';
    s.style.top = (Math.random() * 105 - 5) + '%';
    s.style.setProperty('--r', (Math.random() * 30 - 15) + 'deg');
    s.style.backgroundImage = 'url("' + photos[i % photos.length] + '")';
    s.style.backgroundPosition = (Math.random() * 100) + '% ' + (Math.random() * 100) + '%';
    s.style.backgroundSize = (160 + Math.random() * 160) + '%';
    // slow at first, then faster and faster
    s.style.animationDelay = (TIME * Math.sqrt(i / COUNT)) + 'ms';
    layer.appendChild(s);
  }

  setTimeout(function () {
    home.classList.remove('building');
    home.classList.add('built');
    document.querySelectorAll('.sticker-cell').forEach(function (c, i) {
      c.style.animationDelay = (0.25 + i * 0.12) + 's';
    });
  }, TIME + 300);
})();
