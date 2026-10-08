/* ===================== DIY: make your own sticker =====================
   - write a message, pick a shape and a color
   - slap it on the wall, drag it around
   - hover / tap a sticker: × peels off just that one, ⬇ downloads it
   - download your sticker as a PNG image
   - change the wall                                                     */

const wall    = document.querySelector('.wall');
const input   = document.querySelector('.maker-text');
const preview = document.querySelector('.maker-preview .speech-sticker');
const choice  = { shape: 'label', color: 'red' };

// stickers already on the wall the first time someone visits
const EXAMPLES = [
  { text: 'HELLO MY NAME IS',              shape: 'label',  color: 'ink',    x: 8,  y: 12, tilt: -6 },
  { text: 'LOVE IS A RISK',                shape: 'circle', color: 'yellow', x: 60, y: 8,  tilt: 8 },
  { text: 'REMEMBER WHO YOU WANTED TO BE', shape: 'bubble', color: 'white',  x: 34, y: 58, tilt: -3 },
  { text: 'NO EXCUSES',                    shape: 'label',  color: 'red',    x: 58, y: 74, tilt: 5 }
];

// sticker colors: [background, text]
const COLORS = {
  red:    ['#C8102E', '#ffffff'],
  green:  ['#2F5233', '#ffffff'],
  yellow: ['#F2C230', '#1A1A1A'],
  ink:    ['#1A1A1A', '#ffffff'],
  white:  ['#ffffff', '#1A1A1A']
};


/* ---------- 1. the maker ---------- */

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

function message() {
  return (input.value.trim() || 'I WAS HERE').toUpperCase();
}

function updatePreview() {
  preview.className = 'speech-sticker ' + choice.shape + ' ' + choice.color;
  preview.textContent = message();
}
input.addEventListener('input', updatePreview);


/* ---------- 2. the wall ---------- */

let saved = load();
let stickers = saved.stickers || EXAMPLES.map(function (s) { return Object.assign({}, s); });
// the main wall is your own photo (images/diy-wall.jpg); if it isn't there yet,
// that button is hidden and the diamond plate photo is used instead
const MY_WALL = 'images/diy-wall.jpg';
const FALLBACK_WALL = 'images/collection/c03.jpg';
setWall(saved.wall !== undefined ? saved.wall : MY_WALL);
const test = new Image();
test.onerror = function () {
  document.querySelector('.wall-mine').hidden = true;
  if (saved.wall === MY_WALL || saved.wall === undefined) setWall(FALLBACK_WALL);
};
test.src = MY_WALL;
stickers.forEach(function (data) { addSticker(data, false); });

function addSticker(data, slap) {
  const s = document.createElement('div');
  s.className = 'speech-sticker ' + data.shape + ' ' + data.color;
  s.textContent = data.text;
  s.style.left = data.x + '%';
  s.style.top  = data.y + '%';
  s.style.setProperty('--tilt', data.tilt + 'deg');
  if (slap) s.classList.add('slapped');

  // little buttons that show when the sticker is selected
  const tools = document.createElement('span');
  tools.className = 'sticker-tools';
  tools.innerHTML = '<button class="tool-del" aria-label="Delete sticker">×</button>' +
                    '<button class="tool-dl" aria-label="Download sticker">⬇</button>';
  s.append(tools);

  // × : peel off ONLY this sticker (the others stay)
  tools.querySelector('.tool-del').addEventListener('click', function (evt) {
    evt.stopPropagation();
    s.classList.add('peeling');                 // peels off, then disappears
    setTimeout(function () { s.remove(); }, 300);
    stickers = stickers.filter(function (d) { return d !== data; });
    save();
  });
  tools.querySelector('.tool-dl').addEventListener('click', function (evt) {
    evt.stopPropagation();
    downloadSticker(data);
  });

  wall.append(s);
  makeDraggable(s, data);
}

// "slap it" button
document.querySelector('.slap-btn').addEventListener('click', function () {
  const data = {
    text: message(),
    shape: choice.shape,
    color: choice.color,
    x: 5 + Math.random() * 60,
    y: 5 + Math.random() * 70,
    tilt: Math.round(Math.random() * 16 - 8)
  };
  stickers.push(data);
  addSticker(data, true);
  save();
  input.value = '';
  updatePreview();
});

// "download sticker" button: downloads the one in the preview
document.querySelector('.download-btn').addEventListener('click', function () {
  downloadSticker({ text: message(), shape: choice.shape, color: choice.color });
});

// tap the empty wall: unselect
wall.addEventListener('pointerdown', function (evt) {
  if (evt.target === wall) unselect();
});

function unselect() {
  wall.querySelectorAll('.selected').forEach(function (s) { s.classList.remove('selected'); });
}


/* ---------- 3. change the wall ---------- */

function setWall(src) {
  wall.style.backgroundImage = src
    ? 'linear-gradient(rgba(26,26,26,.35), rgba(26,26,26,.35)), url("' + src + '")'
    : 'none';
  wall.classList.toggle('plain', !src);
  document.querySelectorAll('.wall-pick').forEach(function (b) {
    b.classList.toggle('active', b.dataset.wall === src);
  });
  saved.wall = src;
}

document.querySelectorAll('.wall-pick').forEach(function (b) {
  b.addEventListener('click', function () {
    setWall(b.dataset.wall);
    save();
  });
});


/* ---------- 4. drag a sticker (a tap selects it) ---------- */

function makeDraggable(el, data) {
  el.addEventListener('pointerdown', function (evt) {
    if (evt.target.closest('.sticker-tools')) return;
    evt.preventDefault();
    el.setPointerCapture(evt.pointerId);
    const box = wall.getBoundingClientRect();
    const startX = evt.clientX, startY = evt.clientY;
    const startLeft = el.offsetLeft, startTop = el.offsetTop;
    let moved = false;

    function move(e) {
      if (Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) > 4) moved = true;
      if (!moved) return;
      el.classList.add('dragging');
      data.x = Math.max(0, Math.min(90, (startLeft + e.clientX - startX) / box.width * 100));
      data.y = Math.max(0, Math.min(90, (startTop + e.clientY - startY) / box.height * 100));
      el.style.left = data.x + '%';
      el.style.top  = data.y + '%';
    }
    function up() {
      el.classList.remove('dragging');
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      if (!moved) {                       // a tap: select / unselect
        const was = el.classList.contains('selected');
        unselect();
        if (!was) el.classList.add('selected');
      }
      save();
    }
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
}


/* ---------- 5. download a sticker as a PNG ---------- */

function downloadSticker(data) {
  const S = 3;                                 // 3x size, so it prints sharp
  const font = '900 ' + (22 * S) + 'px Arial, Helvetica, sans-serif';
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = font;

  // split the message into lines that fit
  const maxW = (data.shape === 'circle' ? 150 : 230) * S;
  const lines = [];
  data.text.split(' ').forEach(function (word) {
    const last = lines[lines.length - 1];
    if (last && ctx.measureText(last + ' ' + word).width <= maxW) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  });
  const lineH = 25 * S;
  const textW = Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; }));
  const textH = lines.length * lineH;

  // sticker size
  const pad = 22 * S, edge = 8 * S, margin = 6 * S;
  let w = textW + pad * 2, h = textH + pad * 2;
  if (data.shape === 'circle') { w = h = Math.max(w, h) * 1.12; }

  c.width = w + (edge + margin) * 2;
  c.height = h + (edge + margin) * 2;
  const x = edge + margin, y = edge + margin;

  // draw the shape twice: big white (die-cut edge), then the color
  function shape(px, py, pw, ph, grow) {
    ctx.beginPath();
    if (data.shape === 'circle') {
      ctx.arc(px + pw / 2, py + ph / 2, pw / 2 + grow, 0, Math.PI * 2);
    } else {
      const r = (data.shape === 'bubble' ? 30 : 10) * S + grow;
      const bl = data.shape === 'bubble' ? 4 * S + grow : r;   // bubble: sharp bottom-left
      ctx.roundRect(px - grow, py - grow, pw + grow * 2, ph + grow * 2, [r, r, r, bl]);
    }
  }
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 6 * S;
  ctx.fillStyle = '#ffffff';
  shape(x, y, w, h, edge); ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = COLORS[data.color][0];
  shape(x, y, w, h, 0); ctx.fill();
  if (data.color === 'white') { ctx.strokeStyle = '#DDD6C8'; ctx.lineWidth = 2 * S; ctx.stroke(); }

  // the text
  ctx.fillStyle = COLORS[data.color][1];
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach(function (line, i) {
    ctx.fillText(line, x + w / 2, y + h / 2 - textH / 2 + lineH * (i + 0.5));
  });

  // save the file
  const a = document.createElement('a');
  a.download = 'sticker-' + data.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.png';
  a.href = c.toDataURL('image/png');
  a.click();
}


/* ---------- 6. remember the wall on this device ---------- */

function save() {
  try {
    localStorage.setItem('diy-wall', JSON.stringify({ stickers: stickers, wall: saved.wall }));
  } catch (e) {}
}
function load() {
  try { return JSON.parse(localStorage.getItem('diy-wall')) || {}; } catch (e) { return {}; }
}
