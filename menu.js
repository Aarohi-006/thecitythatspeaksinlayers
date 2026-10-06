/* ===================== MINI STICKER SHEET (menu) =====================
   A small row of the 6 stickers at the bottom of every inner page.
   The first item (a tiny sheet) always goes back to the full sheet.
   The page you're on is an empty slot (you peeled it off).
   Needs sticker-shapes.js to be loaded first.                        */

const MENU = [
  { sticker: 'apple',    page: 'stories.html',       label: 'STORIES' },
  { sticker: 'taxi',     page: 'neighborhoods.html', label: 'NEIGHBORHOODS' },
  { sticker: 'subway',   page: 'collection.html',    label: 'COLLECTION' },
  { sticker: 'building', page: 'artistvoices.html',  label: 'ARTIST VOICE' },
  { sticker: 'pizza',    page: 'public-speech.html', label: 'PUBLIC SPEECH' },
  { sticker: 'pretzel',  page: 'about.html',         label: 'ABOUT' }
];

const MINI = 56;   // size of a mini sticker, in px

const nav = document.querySelector('.mini-sheet');
const here = nav.dataset.current;   // which sticker this page belongs to

MENU.forEach(function (item, i) {
  const shape = STICKER_SHAPES[item.sticker];
  const scale = MINI / 150;
  const w = shape.w * scale;
  const h = shape.h * scale;

  const link = document.createElement('a');
  link.className = 'mini';
  link.style.setProperty('--tilt', (i % 2 ? 4 : -4) + 'deg');

  if (item.sticker === here) {
    // this page: an empty glue mark that takes you back to the sheet
    link.href = 'index.html';
    link.classList.add('mini-here');
    const mark = document.createElement('span');
    mark.className = 'mini-ghost';
    mark.style.width = w + 'px';
    mark.style.height = h + 'px';
    mark.style.clipPath = 'polygon(' + shape.points.split(' ').map(function (p) {
      const xy = p.split(',');
      return (xy[0] * scale) + 'px ' + (xy[1] * scale) + 'px';
    }).join(', ') + ')';
    link.append(mark);
    link.setAttribute('aria-label', 'Back to the sticker sheet');
    link.dataset.label = 'YOU ARE HERE';
  } else {
    // another page: a mini sticker
    link.href = item.page;
    const img = document.createElement('img');
    img.src = 'images/' + shape.file;
    img.alt = item.label;
    img.style.width = w + 'px';
    img.style.height = h + 'px';
    link.append(img);
    link.dataset.label = item.label;

    // click: the sticker flies off, then the page opens
    link.addEventListener('click', function (evt) {
      if (evt.detail === 0) return;        // keyboard: open straight away
      evt.preventDefault();
      link.classList.add('mini-off');
      setTimeout(function () { window.location.href = item.page; }, 380);
    });
  }

  nav.append(link);
});

// coming back with the Back button: put the stickers back
window.addEventListener('pageshow', function () {
  nav.querySelectorAll('.mini-off').forEach(function (m) { m.classList.remove('mini-off'); });
});
