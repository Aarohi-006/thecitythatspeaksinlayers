/* ===================== STICKER SHEET (homepage) =====================
   Uses peel.js by Andrew Plummer (MIT license):
   https://github.com/andrewplummer/peel-js

   - hover:   the corner lifts a little
   - drag:    peel the sticker with your mouse or finger
   - let go early:  it springs back down with a bounce
   - pull far / flick fast:  it tumbles away the way you threw it,
                             leaving a sticky ghost mark, then the page opens
   - tap:     it peels off by itself                                       */

// set to true to stay on the sheet (stickers pop back instead of opening pages)
const DEMO_MODE = document.body.dataset.demo === 'true';

const cells = document.querySelectorAll('.sticker-cell');

// stickers are bigger on a big screen (1 = normal size)
const SIZE = window.innerWidth > 800 ? 1.4 : 1;

// make a bigger copy of a sticker's size and outline
function scaleShape(s) {
  return {
    file: s.file,
    src: s.src,
    w: Math.round(s.w * SIZE),
    h: Math.round(s.h * SIZE),
    points: s.points.split(' ').map(function (p) {
      return p.split(',').map(function (n) { return (n * SIZE).toFixed(1); }).join(',');
    }).join(' ')
  };
}

cells.forEach(function (cell, i) {
  const shape = scaleShape(STICKER_SHAPES[cell.dataset.sticker]);
  const el    = cell.querySelector('.peel');
  const under = cell.querySelector('.under');
  const ghost = cell.querySelector('.ghost');

  // 1. size the sticker and give it its drawing
  const slot = cell.querySelector('.slot');
  slot.style.width  = el.style.width  = shape.w + 'px';
  slot.style.height = el.style.height = shape.h + 'px';
  el.querySelector('.peel-top').style.backgroundImage = 'url("' + (shape.src || 'images/' + shape.file) + '")';

  // the ghost mark has the same outline as the sticker
  ghost.style.clipPath = 'polygon(' + shape.points.split(' ').map(function (p) {
    const xy = p.split(',');
    return xy[0] + 'px ' + xy[1] + 'px';
  }).join(', ') + ')';

  // 2. make it peelable, cut to the drawing's outline
  // the box corner we peel from (set in index.html)...
  const box = { TOP_LEFT: [0, 0], TOP_RIGHT: [shape.w, 0],
                BOTTOM_LEFT: [0, shape.h], BOTTOM_RIGHT: [shape.w, shape.h] }[cell.dataset.corner];

  // ...moved to the nearest point of the drawing's outline,
  // so the curl is on the sticker itself, not on empty space
  const start = { x: box[0], y: box[1] };
  let best = Infinity;
  shape.points.split(' ').forEach(function (p) {
    const xy = p.split(',').map(Number);
    const d = Math.hypot(xy[0] - box[0], xy[1] - box[1]);
    if (d < best) { best = d; start.x = xy[0]; start.y = xy[1]; }
  });

  const peel = new Peel(el, {
    corner: [start.x, start.y],
    polygon: { points: shape.points },
    topShadow: false,
    bottomShadow: false,
    backShadowAlpha: 0.15,
    backReflection: true,          // the shine along the fold
    backReflectionAlpha: 0.5,
    backReflectionSize: 0.04
  });

  // direction from the corner toward the middle of the sticker
  const mid  = { x: shape.w / 2, y: shape.h / 2 };
  const dist = Math.hypot(mid.x - start.x, mid.y - start.y);
  const dir  = { x: (mid.x - start.x) / dist, y: (mid.y - start.y) / dist };
  function along(d) { return { x: start.x + dir.x * d, y: start.y + dir.y * d }; }

  const small = Math.min(shape.w, shape.h);
  const rest  = along(small * 0.22);   // resting: a corner already curled up, so people see it can peel
  const lift  = along(small * 0.5);    // hover: it lifts more
  const off   = along(dist * 4);       // all the way off

  let pos = { x: rest.x, y: rest.y };
  const fullDistance = Math.hypot(off.x - start.x, off.y - start.y);
  const restAmount   = Math.hypot(rest.x - start.x, rest.y - start.y) / fullDistance;
  let dragging = false;
  let leaving  = false;
  let anim     = null;
  let trail    = [];   // the last few pointer positions, to measure the flick

  // how far the sticker is peeled: 0 = stuck down, 1 = all the way off
  function amountPeeled() {
    const full = Math.hypot(off.x - start.x, off.y - start.y);
    return Math.hypot(pos.x - start.x, pos.y - start.y) / full;
  }

  // move the peeled corner to (x, y)
  function setPos(x, y) {
    pos = { x: x, y: y };
    peel.setPeelPosition(x, y);
    // the page name only starts to show once you peel past the resting curl
    under.style.opacity = Math.max(0, Math.min(1, (amountPeeled() - restAmount - 0.03) * 4));
  }

  // easing curves
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIn(t)  { return t * t; }
  function springy(t) {                       // overshoots and wobbles
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -9 * t) * Math.sin((t * 9 - 0.75) * (2 * Math.PI / 3)) + 1;
  }

  // smoothly move the corner to a point
  function animateTo(target, ms, ease, done) {
    cancelAnimationFrame(anim);
    const from = { x: pos.x, y: pos.y };
    const t0 = performance.now();
    function step(now) {
      const t = Math.min(1, (now - t0) / ms);
      const e = ease(t);
      setPos(from.x + (target.x - from.x) * e,
             from.y + (target.y - from.y) * e);
      if (t < 1) anim = requestAnimationFrame(step);
      else if (done) done();
    }
    anim = requestAnimationFrame(step);
  }

  // let go too early: spring back down with a bounce
  function snapBack() {
    animateTo(rest, 750, springy);
  }

  // peel it off and throw it in direction (vx, vy)
  function tumble(vx, vy) {
    if (leaving) return;
    leaving = true;
    ghost.classList.add('show');               // sticky mark left behind

    // finish peeling, then the whole sticker flies off spinning
    animateTo(off, 380, easeIn, function () {
      const speed = Math.max(1, Math.hypot(vx, vy));
      const dx = (vx / speed) * 420;
      const dy = (vy / speed) * 420 + 120;     // a little gravity
      const spin = (vx >= 0 ? 1 : -1) * (160 + speed * 60);
      el.style.setProperty('--tx', dx + 'px');
      el.style.setProperty('--ty', dy + 'px');
      el.style.setProperty('--spin', spin + 'deg');
      el.classList.add('tumbling');

      setTimeout(function () {
        if (DEMO_MODE) respawn();
        else window.location.href = cell.href;
      }, 550);
    });
  }

  // demo: the sticker pops back onto the sheet
  function respawn() {
    setTimeout(function () {
      el.classList.remove('tumbling');
      setPos(rest.x, rest.y);
      el.classList.add('pop');
      ghost.classList.remove('show');
      setTimeout(function () { el.classList.remove('pop'); leaving = false; }, 450);
    }, 700);
  }

  // tap: throw it away from the corner it peels from
  function tapOff() {
    tumble(dir.x, dir.y);
  }

  // hover: lift the corner a little
  cell.addEventListener('mouseenter', function () {
    if (!dragging && !leaving) animateTo(lift, 250, easeOut);
  });
  cell.addEventListener('mouseleave', function () {
    if (!dragging && !leaving) animateTo(rest, 300, easeOut);
  });

  // drag: the corner follows the mouse / finger
  peel.handleDrag(function (evt) {
    if (leaving) return;
    dragging = true;
    cancelAnimationFrame(anim);
    const p = evt.changedTouches ? evt.changedTouches[0] : evt;
    const box = el.getBoundingClientRect();
    setPos(p.clientX - box.left, p.clientY - box.top);

    // remember where the pointer was, to know how fast it's moving
    trail.push({ x: p.clientX, y: p.clientY, t: performance.now() });
    if (trail.length > 5) trail.shift();
  });

  peel.handlePress(tapOff);

  // let go after dragging
  function release() {
    if (!dragging) return;
    dragging = false;

    // flick speed (pixels per millisecond)
    let vx = 0, vy = 0;
    if (trail.length > 1) {
      const a = trail[0], b = trail[trail.length - 1];
      const dt = Math.max(1, b.t - a.t);
      vx = (b.x - a.x) / dt;
      vy = (b.y - a.y) / dt;
    }
    trail = [];
    const flick = Math.hypot(vx, vy) > 0.8;

    if (flick || amountPeeled() > 0.3) {
      // thrown, or pulled far enough: off it goes
      if (!flick) { vx = dir.x; vy = dir.y; }
      tumble(vx, vy);
    } else {
      snapBack();
    }
  }
  document.addEventListener('mouseup', release);
  document.addEventListener('touchend', release);

  // the link itself: JavaScript opens the page after the peel.
  // (keyboard users pressing Enter still go straight to the page)
  cell.addEventListener('click', function (evt) {
    if (evt.detail !== 0) evt.preventDefault();
  });

  // coming back with the Back button: stick everything back down
  window.addEventListener('pageshow', function () {
    leaving = false;
    dragging = false;
    cancelAnimationFrame(anim);
    el.classList.remove('tumbling');
    ghost.classList.remove('show');
    setPos(rest.x, rest.y);
  });

  // stickers get "slapped" onto the sheet one by one
  cell.style.animationDelay = (i * 0.12) + 's';
});
