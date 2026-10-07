/* ===================== DIY: make your own sticker ===================== */

const wall    = document.querySelector('.wall');
const input   = document.querySelector('.maker-text');
const preview = document.querySelector('.maker-preview .speech-sticker');
const choice  = { shape: 'label', color: 'red' };

// 1. pick a shape and a color
document.querySelectorAll('.maker-row').forEach(function (row) {
  row.addEventListener('click', function (evt) {
    const btn = evt.target.closest('button');
    if (!btn) return;
    row.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    choice[row.dataset.pick] = btn.dataset.value;
    updatePreview();
  });
});

// 2. the preview changes as you type
function message() {
  return (input.value.trim() || 'I WAS HERE').toUpperCase();
}

function updatePreview() {
  preview.className = 'speech-sticker ' + choice.shape + ' ' + choice.color;
  preview.textContent = message();
}
input.addEventListener('input', updatePreview);

// 3. make a sticker on the wall
function addSticker(data, slap) {
  const s = document.createElement('span');
  s.className = 'speech-sticker mine ' + data.shape + ' ' + data.color;
  s.textContent = data.text;
  s.style.left = data.x + '%';
  s.style.top  = data.y + '%';
  s.style.setProperty('--tilt', data.tilt + 'deg');
  if (slap) s.classList.add('slapped');
  wall.append(s);
  makeDraggable(s, data);
  return s;
}

// 4. "slap it" button: put it somewhere random on the wall
let mine = load();
mine.forEach(function (data) { addSticker(data, false); });

document.querySelector('.slap-btn').addEventListener('click', function () {
  const data = {
    text: message(),
    shape: choice.shape,
    color: choice.color,
    x: 5 + Math.random() * 60,
    y: 5 + Math.random() * 70,
    tilt: Math.round(Math.random() * 16 - 8)
  };
  mine.push(data);
  addSticker(data, true);
  save();
  input.value = '';
  updatePreview();
});

// 5. "peel mine off": remove your own stickers (the examples stay)
document.querySelector('.clear-btn').addEventListener('click', function () {
  wall.querySelectorAll('.mine').forEach(function (s) { s.remove(); });
  mine = [];
  save();
});

// 6. drag a sticker to move it
function makeDraggable(el, data) {
  el.addEventListener('pointerdown', function (evt) {
    evt.preventDefault();
    el.setPointerCapture(evt.pointerId);
    el.classList.add('dragging');
    const box = wall.getBoundingClientRect();
    const startX = evt.clientX, startY = evt.clientY;
    const startLeft = el.offsetLeft, startTop = el.offsetTop;

    function move(e) {
      const left = startLeft + (e.clientX - startX);
      const top  = startTop  + (e.clientY - startY);
      data.x = Math.max(0, Math.min(90, left / box.width * 100));
      data.y = Math.max(0, Math.min(90, top / box.height * 100));
      el.style.left = data.x + '%';
      el.style.top  = data.y + '%';
    }
    function up() {
      el.classList.remove('dragging');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      save();
    }
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
}

// 7. remember your stickers on this device
function save() {
  try { localStorage.setItem('my-stickers', JSON.stringify(mine)); } catch (e) {}
}
function load() {
  try { return JSON.parse(localStorage.getItem('my-stickers')) || []; } catch (e) { return []; }
}
