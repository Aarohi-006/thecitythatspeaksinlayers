/* ===================== MINI STICKER SHEET (menu) =====================
   A strip of the 6 stickers on the left side of every inner page.
   - the first item (a tiny sheet) always goes back to the full sheet
   - the page you're on is an empty glue mark (you peeled it off)
   - hover a sticker: its corner peels up
   - click a sticker: it peels off, then its page opens
   Needs sticker-shapes.js loaded first (and peel.js for the peel effect).
   Its styles are built in below, so it works on any page.
   Peel effect: peel.js by Andrew Plummer (MIT license)            */

/* ---------- the menu's own styles (added to the page by this file) ---------- */
const MENU_CSS = `
/* ===================== MINI STICKER SHEET (menu) =====================
   Sits on the left side of the screen, in the middle (next to the spine).
   On phones it moves to the bottom. */

/* leave room on the left so the menu never covers the page */
body:has(.mini-sheet) {
  padding-left: 100px;
}

.mini-sheet {
  position: fixed;
  top: 50%;
  left: 32px;                      /* just right of the black spine */
  z-index: 50;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 10px;
  background: var(--sheet);
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.14);
}

.mini {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
}

/* the spot each mini sticker sits in */
.mini-slot {
  position: relative;
  display: block;
}

/* glue mark under every sticker (seen when it peels) */
.mini-ghost {
  position: absolute;
  inset: 0;
  background-color: rgba(26, 26, 26, 0.08);
  background-image: radial-gradient(rgba(26, 26, 26, 0.16) 1px, transparent 1.4px);
  background-size: 5px 5px;
}

/* mini sticker layers (peel.js) */
.mini .peel {
  position: relative;
  z-index: 1;
}

.mini .peel-top {
  background-color: transparent;
  background-size: 100% 100%;
}

.mini .peel-back {
  background-color: #EFEAE0;
}

.mini .peel-bottom {
  background-color: transparent;
}

/* the page name, shown to the right on hover */
.mini::after {
  content: attr(data-label);
  position: absolute;
  top: 50%;
  left: calc(100% + 14px);
  transform: translateY(-50%);
  padding: 5px 9px;
  border-radius: 6px;
  background: var(--ink);
  color: #ffffff;
  white-space: nowrap;
  font-family: "Courier New", monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  opacity: 0;
  transition: opacity 200ms ease;
  pointer-events: none;
}

.mini:hover::after,
.mini:focus-visible::after {
  opacity: 1;
}

/* first item: a little house sticker = back to the homepage */
.sheet-icon {
  display: block;
  width: 44px;
  height: 44px;
  transition: transform 200ms ease;
}

.mini-home {
  padding-bottom: 10px;
  margin-bottom: 4px;
  border-bottom: 1.5px dashed #CFC8B8;
  height: 64px;
}

.sheet-icon svg {
  display: block;
  filter: drop-shadow(0 1.5px 1.5px rgba(0, 0, 0, 0.25));
}

.mini-home:hover .sheet-icon {
  transform: rotate(-8deg) translateY(-3px) scale(1.12);
}

/* "you are here": only the glue mark */
.mini-here .mini-ghost {
  background-color: rgba(200, 16, 46, 0.12);
  background-image: radial-gradient(rgba(200, 16, 46, 0.35) 1px, transparent 1.4px);
}

/* phones: the menu moves to the bottom of the screen */
@media (max-width: 800px) {
  body:has(.mini-sheet) {
    padding-left: 0;
    padding-bottom: 84px;
  }
  .mini-sheet {
    top: auto;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: row;
    gap: 4px;
    padding: 8px 12px;
  }
  .mini {
    width: 42px;
    height: 46px;
  }
  .mini-slot {
    transform: scale(0.82);
  }
  .mini-home {
    height: 46px;
    padding: 0 8px 0 0;
    margin: 0 4px 0 0;
    border-bottom: none;
    border-right: 1.5px dashed #CFC8B8;
  }
  .sheet-icon {
    width: 34px;
    height: 34px;
  }
  .mini::after {
    display: none;
  }
}


/* peel.js basics (same as peel.css), in case peel.css is missing */
.mini .peel-layer { position: absolute; z-index: 1; width: 100%; height: 100%; top: 0; left: 0; user-select: none; transform-origin: top left; }
.mini .peel-svg-clip-element, .peel-svg-clip-element { position: absolute; top: -10000px; left: -10000px; width: 1px; height: 1px; opacity: 0; }
.mini .peel { opacity: 1; }

/* if peel.js is missing: plain mini stickers that lift on hover */
.mini-img { display: block; transition: transform 200ms ease; }
.mini:hover .mini-img { transform: rotate(-6deg) translateY(-4px) scale(1.08); }
`;

(function addMenuStyles() {
  if (document.getElementById('mini-menu-css')) return;
  const style = document.createElement('style');
  style.id = 'mini-menu-css';
  style.textContent = MENU_CSS;
  document.head.append(style);
})();

const MENU = [
  { sticker: 'apple',    page: 'stories.html',       label: 'STORIES' },
  { sticker: 'taxi',     page: 'neighborhoods.html', label: 'NEIGHBORHOODS' },
  { sticker: 'subway',   page: 'collection.html',    label: 'COLLECTION' },
  { sticker: 'building', page: 'artistvoices.html',  label: 'ARTIST VOICE' },
  { sticker: 'pizza',    page: 'diy.html',           label: 'DIY' },
  { sticker: 'pretzel',  page: 'about.html',         label: 'ABOUT' }
];

// the little house sticker (drawn in code, no image file needed)
const HOUSE_SVG =
  '<svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">' +
  '<path d="M32 6 L59 30 L53 30 L53 48 L43 58 L11 58 L11 30 L5 30 Z" fill="#fff" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>' +
  '<path d="M15 28 L49 28 L49 47 L42 54 L15 54 Z" fill="#F2C230"/>' +
  '<path d="M32 8 L56 29 L8 29 Z" fill="#C8102E"/>' +
  '<path d="M27 54 L27 41 Q27 37 31 37 L33 37 Q37 37 37 41 L37 54 Z" fill="#1A1A1A"/>' +
  '<rect x="40" y="33" width="6" height="6" rx="1" fill="#1A1A1A"/>' +
  '<path d="M53 48 L43 58 L42 47 Z" fill="#EFEAE0" stroke="#d8d1c3" stroke-width="1"/>' +
  '</svg>';

const MINI = 50;   // size of a mini sticker, in px

// find the menu on the page, or make one if the page doesn't have it
let nav = document.querySelector('.mini-sheet');
if (!nav) {
  nav = document.createElement('nav');
  nav.className = 'mini-sheet';
  document.body.append(nav);
}

// the "home" house at the top (added if the page doesn't have it)
if (!nav.querySelector('.mini-home')) {
  nav.insertAdjacentHTML('afterbegin',
    '<a class="mini mini-home" href="index.html" data-label="HOME" aria-label="Back to the sticker sheet">' +
    '<span class="sheet-icon"></span></a>');
}
nav.querySelector('.mini-home').dataset.label = 'HOME';
nav.querySelector('.sheet-icon').innerHTML = HOUSE_SVG;

// which sticker this page belongs to: from data-current, or from the file name
const fileName = location.pathname.split('/').pop() || 'index.html';
const here = nav.dataset.current ||
  (MENU.find(function (m) { return m.page === fileName; }) || {}).sticker;

// turn "x,y x,y ..." into a smaller copy of the outline
function scalePoints(points, scale) {
  return points.split(' ').map(function (p) {
    const xy = p.split(',');
    return (xy[0] * scale).toFixed(1) + ',' + (xy[1] * scale).toFixed(1);
  }).join(' ');
}

MENU.forEach(function (item) {
  const shape  = STICKER_SHAPES[item.sticker];
  const scale  = MINI / 150;
  const w      = Math.round(shape.w * scale);
  const h      = Math.round(shape.h * scale);
  const points = scalePoints(shape.points, scale);

  const link = document.createElement('a');
  link.className = 'mini';
  link.dataset.label = item.label;

  // the glue mark under every sticker (same outline)
  const slot = document.createElement('span');
  slot.className = 'mini-slot';
  slot.style.width = w + 'px';
  slot.style.height = h + 'px';
  const ghost = document.createElement('span');
  ghost.className = 'mini-ghost';
  ghost.style.clipPath = 'polygon(' + points.split(' ').map(function (p) {
    return p.replace(',', 'px ') + 'px';
  }).join(', ') + ')';
  slot.append(ghost);
  link.append(slot);
  nav.append(link);

  // this page: only the glue mark is left, and it goes back to the sheet
  if (item.sticker === here) {
    link.href = 'index.html';
    link.classList.add('mini-here');
    link.dataset.label = 'YOU ARE HERE';
    link.setAttribute('aria-label', 'You are here. Back to the sticker sheet');
    return;
  }

  // another page: a mini sticker that can peel
  link.href = item.page;
  link.setAttribute('aria-label', item.label);

  // no peel.js on this page: just show the picture
  if (typeof Peel === 'undefined') {
    const img = document.createElement('img');
    img.className = 'mini-img';
    img.src = 'images/' + shape.file;
    img.alt = '';
    img.style.width = w + 'px';
    img.style.height = h + 'px';
    slot.append(img);
    return;
  }

  const el = document.createElement('div');
  el.className = 'peel';
  el.style.width = w + 'px';
  el.style.height = h + 'px';
  el.innerHTML = '<div class="peel-top"></div><div class="peel-back"></div><div class="peel-bottom"></div>';
  el.querySelector('.peel-top').style.backgroundImage = 'url("images/' + shape.file + '")';
  slot.append(el);

  const peel = new Peel(el, {
    corner: Peel.Corners.BOTTOM_RIGHT,
    polygon: { points: points },
    topShadow: false,
    bottomShadow: false,
    backShadowAlpha: 0.15,
    backReflection: true,
    backReflectionAlpha: 0.4
  });

  const start = { x: w, y: h };
  const lift  = { x: w * 0.5, y: h * 0.55 };   // hover: peel up about halfway
  const off   = { x: -w, y: -h };               // click: all the way off
  let pos = { x: start.x, y: start.y };
  let anim = null;
  let leaving = false;

  function animateTo(target, ms, done) {
    cancelAnimationFrame(anim);
    const from = { x: pos.x, y: pos.y };
    const t0 = performance.now();
    function step(now) {
      let t = Math.min(1, (now - t0) / ms);
      t = 1 - Math.pow(1 - t, 3);
      pos = { x: from.x + (target.x - from.x) * t, y: from.y + (target.y - from.y) * t };
      peel.setPeelPosition(pos.x, pos.y);
      if (t < 1) anim = requestAnimationFrame(step);
      else if (done) done();
    }
    anim = requestAnimationFrame(step);
  }

  link.addEventListener('mouseenter', function () { if (!leaving) animateTo(lift, 260); });
  link.addEventListener('mouseleave', function () { if (!leaving) animateTo(start, 300); });
  link.addEventListener('focus',      function () { if (!leaving) animateTo(lift, 260); });
  link.addEventListener('blur',       function () { if (!leaving) animateTo(start, 300); });

  // click: peel it off, then open the page
  link.addEventListener('click', function (evt) {
    evt.preventDefault();
    if (leaving) return;
    leaving = true;
    animateTo(off, 420, function () { window.location.href = item.page; });
  });

  // coming back with the Back button: stick it back down
  window.addEventListener('pageshow', function () {
    leaving = false;
    cancelAnimationFrame(anim);
    pos = { x: start.x, y: start.y };
    peel.setPeelPosition(start.x, start.y);
  });
});
