/* ===================== STORIES: the book, as layers of stickers =====================
   Uses peel.js by Andrew Plummer (MIT license):
   https://github.com/andrewplummer/peel-js

   - 3 chapters (tabs at the top)
   - each chapter is a stack of stickers, one per section
   - the sticker on top shows its title and big line; its full text shows beside it
   - drag a corner or tap to peel it off and read the next one                */

const tabs     = document.querySelectorAll('.chapter-tab');
const chapters = document.querySelectorAll('.chapter');
const ready    = [];   // chapters that are already set up

/* ---------- switch chapters ---------- */
function showChapter(n) {
  tabs.forEach(function (t) { t.classList.toggle('active', +t.dataset.chapter === n); });
  chapters.forEach(function (c) { c.classList.toggle('active', +c.dataset.chapter === n); });
  // peel.js needs to measure the stickers, so set a chapter up the first time it is visible
  if (!ready[n]) ready[n] = setupChapter(chapters[n]);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach(function (t) {
  t.addEventListener('click', function () { showChapter(+t.dataset.chapter); });
});


/* ---------- one chapter: a stack of peelable stickers ---------- */
function setupChapter(chapter) {
  const stories = Array.from(chapter.querySelectorAll('.story'));
  const reader  = chapter.querySelector('.story-reader');
  const count   = chapter.querySelector('.count');
  let left = stories.length;

  // the first section sits on top
  stories.forEach(function (el, i) {
    el.style.zIndex = stories.length - i;
    const offsets = [[0, 0], [8, -6], [-6, 8], [5, 5]];
    el.style.top  = offsets[i % 4][1] + 'px';
    el.style.left = offsets[i % 4][0] + 'px';
  });

  // show the text of the sticker that's on top
  function updateReader() {
    const top = stories.find(function (s) { return !s.classList.contains('gone'); });
    count.textContent = left + (left === 1 ? ' LAYER LEFT' : ' LAYERS LEFT');
    reader.classList.remove('fade-in');
    void reader.offsetWidth;                    // restart the fade animation
    reader.classList.add('fade-in');
    if (!top) {
      reader.querySelector('.reader-label').textContent = 'THE BARE SURFACE';
      reader.querySelector('.reader-title').textContent = 'Every layer was someone saying: I was here.';
      reader.querySelector('.reader-text').innerHTML = '';
      return;
    }
    reader.querySelector('.reader-label').textContent = top.querySelector('.small-label').textContent;
    reader.querySelector('.reader-title').textContent = top.querySelector('.story-title').textContent;
    reader.querySelector('.reader-text').innerHTML = top.querySelector('.story-text').innerHTML;
  }

  const layers = stories.map(function (el) {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const r = 10;   // rounded corners

    const peel = new Peel(el, {
      corner: Peel.Corners[el.dataset.corner],
      path: { d: 'M' + r + ',0 H' + (w - r) + ' Q' + w + ',0 ' + w + ',' + r +
                 ' V' + (h - r) + ' Q' + w + ',' + h + ' ' + (w - r) + ',' + h +
                 ' H' + r + ' Q0,' + h + ' 0,' + (h - r) +
                 ' V' + r + ' Q0,0 ' + r + ',0 Z' },
      topShadow: false,
      backShadowAlpha: 0.2,
      bottomShadow: false
    });

    const start = { x: peel.corner.x, y: peel.corner.y };
    const rest  = { x: start.x + (start.x === 0 ? 14 : -14), y: start.y + (start.y === 0 ? 14 : -14) };
    const lift  = { x: start.x + (start.x === 0 ? 34 : -34), y: start.y + (start.y === 0 ? 34 : -34) };
    const off   = { x: start.x === 0 ? w * 2 : -w, y: start.y === 0 ? h * 2 : -h };

    let pos = { x: start.x, y: start.y };
    let dragging = false;
    let leaving  = false;
    let anim = null;

    function amountPeeled() {
      const full = Math.hypot(off.x - start.x, off.y - start.y);
      return Math.hypot(pos.x - start.x, pos.y - start.y) / full;
    }

    function setPos(x, y) {
      pos = { x: x, y: y };
      peel.setPeelPosition(x, y);
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

    // peel this sticker off; the next one is now on top
    function peelOff() {
      if (leaving) return;
      leaving = true;
      animateTo(off, 600, function () {
        el.classList.add('gone');
        left = left - 1;
        updateReader();
      });
    }

    el.addEventListener('mouseenter', function () { if (!dragging && !leaving) animateTo(lift, 250); });
    el.addEventListener('mouseleave', function () { if (!dragging && !leaving) animateTo(rest, 300); });

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
      else animateTo(rest, 350);
    }
    document.addEventListener('mouseup', release);
    document.addEventListener('touchend', release);

    // put it back on the stack
    function reset() {
      cancelAnimationFrame(anim);
      leaving = false;
      dragging = false;
      el.classList.remove('gone');
      setPos(rest.x, rest.y);
    }

    setPos(rest.x, rest.y);   // a corner is already curled, so people see it peels
    return { reset: reset };
  });

  // "stick them back": the whole stack goes back on
  chapter.querySelector('.restick').addEventListener('click', function () {
    layers.forEach(function (layer) { layer.reset(); });
    left = stories.length;
    updateReader();
  });

  // "next chapter"
  const next = chapter.querySelector('button.next-chapter');
  if (next) {
    next.addEventListener('click', function () { showChapter(+chapter.dataset.chapter + 1); });
  }

  updateReader();
  return true;
}

// start with chapter 01
showChapter(0);
