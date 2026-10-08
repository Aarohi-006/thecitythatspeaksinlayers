/* ===================== MINI STICKER SHEET (menu) =====================
   A strip of the 6 stickers on the left side of every inner page.
   - the first item (a tiny sheet) always goes back to the full sheet
   - the page you're on is an empty glue mark (you peeled it off)
   - hover a sticker: its corner peels up
   - click a sticker: it peels off, then its page opens
   Needs peel.js and sticker-shapes.js to be loaded first.
   Peel effect: peel.js by Andrew Plummer (MIT license)            */

const MENU = [
  { sticker: 'apple',    page: 'stories.html',       label: 'STORIES' },
  { sticker: 'taxi',     page: 'neighborhoods.html', label: 'NEIGHBORHOODS' },
  { sticker: 'subway',   page: 'collection.html',    label: 'COLLECTION' },
  { sticker: 'building', page: 'artistvoices.html',  label: 'ARTIST VOICE' },
  { sticker: 'pizza',    page: 'diy.html',           label: 'DIY' },
  { sticker: 'pretzel',  page: 'about.html',         label: 'ABOUT' }
];

const MINI = 50;   // size of a mini sticker, in px

const nav  = document.querySelector('.mini-sheet');
const here = nav.dataset.current;   // which sticker this page belongs to

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
