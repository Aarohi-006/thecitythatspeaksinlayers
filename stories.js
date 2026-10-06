/* ===================== STORIES: peel the layers =====================
   Uses peel.js by Andrew Plummer (MIT license):
   https://github.com/andrewplummer/peel-js

   The stories are stacked like stickers on a pole.
   Drag (or tap) the top one to peel it off and see the one underneath. */

const stories = Array.from(document.querySelectorAll('.story'));
const count   = document.querySelector('.count');
const restick = document.querySelector('.restick');
let left = stories.length;

const layers = stories.map(function (el, i) {
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const r = 10;   // rounded corners

  const peel = new Peel(el, {
    corner: Peel.Corners[el.dataset.corner],
    // the story's shape: a rectangle with rounded corners
    path: { d: 'M' + r + ',0 H' + (w - r) + ' Q' + w + ',0 ' + w + ',' + r +
               ' V' + (h - r) + ' Q' + w + ',' + h + ' ' + (w - r) + ',' + h +
               ' H' + r + ' Q0,' + h + ' 0,' + (h - r) +
               ' V' + r + ' Q0,0 ' + r + ',0 Z' },
    topShadow: false,
    backShadowAlpha: 0.2,
    bottomShadow: false
  });

  const start = { x: peel.corner.x, y: peel.corner.y };
  const lift  = { x: start.x + (start.x === 0 ? 26 : -26),
                  y: start.y + (start.y === 0 ? 26 : -26) };
  const off   = { x: start.x === 0 ? w * 2 : -w,
                  y: start.y === 0 ? h * 2 : -h };

  let pos = { x: start.x, y: start.y };
  let dragging = false;
  let leaving  = false;   // true while it's peeling off
  let anim = null;

  function amountPeeled() {
    const full = Math.hypot(off.x - start.x, off.y - start.y);
    return Math.hypot(pos.x - start.x, pos.y - start.y) / full;
  }

  function setPos(x, y) {
    pos = { x: x, y: y };
    peel.setPeelPosition(x, y);
    // lying flat: hide the back of the paper
    el.classList.toggle('flat', amountPeeled() < 0.005);
  }

  function animateTo(target, ms, done) {
    cancelAnimationFrame(anim);
    const from = { x: pos.x, y: pos.y };
    const t0 = performance.now();
    function step(now) {
      let t = Math.min(1, (now - t0) / ms);
      t = 1 - Math.pow(1 - t, 3);
      setPos(from.x + (target.x - from.x) * t, from.y + (target.y - from.y) * t);
      if (t < 1) anim = requestAnimationFrame(step);
      else if (done) done();
    }
    anim = requestAnimationFrame(step);
  }

  // peel this layer off and hide it
  function peelOff() {
    if (leaving) return;
    leaving = true;
    animateTo(off, 600, function () {
      el.classList.add('gone');
      left = left - 1;
      count.textContent = left;
    });
  }

  el.addEventListener('mouseenter', function () { if (!dragging && !leaving) animateTo(lift, 250); });
  el.addEventListener('mouseleave', function () { if (!dragging && !leaving) animateTo(start, 300); });

  peel.handleDrag(function (evt) {
    if (leaving) return;
    dragging = true;
    cancelAnimationFrame(anim);
    const p = evt.changedTouches ? evt.changedTouches[0] : evt;
    const box = el.getBoundingClientRect();
    setPos(p.clientX - box.left, p.clientY - box.top);
  });

  peel.handlePress(peelOff);

  function release() {
    if (!dragging) return;
    dragging = false;
    if (amountPeeled() > 0.15) peelOff();
    else animateTo(start, 350);
  }
  document.addEventListener('mouseup', release);
  document.addEventListener('touchend', release);

  // put this layer back down
  function reset() {
    cancelAnimationFrame(anim);
    leaving = false;
    dragging = false;
    el.classList.remove('gone');
    setPos(start.x, start.y);
  }

  setPos(start.x, start.y);
  return { reset: reset };
});

// "stick them back" button: every layer goes back on the pole
restick.addEventListener('click', function () {
  layers.forEach(function (layer) { layer.reset(); });
  left = stories.length;
  count.textContent = left;
});
