/* ===================== COLLECTION: the sticker album ===================== */

const items   = Array.from(document.querySelectorAll('.item'));
const filters = document.querySelectorAll('.filter');

// 1. each photo gets its own small tilt, like it was stuck on by hand
items.forEach(function (item, i) {
  const tilt = [-3, 2, -1.5, 3, -2.5, 1.5][i % 6];
  item.style.setProperty('--tilt', tilt + 'deg');
});

// 2. photos get "slapped" onto the page as you scroll to them
const watcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('stuck');
      watcher.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

items.forEach(function (item) { watcher.observe(item); });

// 3. filters: only show photos of one kind
filters.forEach(function (button) {
  button.addEventListener('click', function () {
    const cat = button.dataset.cat;
    filters.forEach(function (b) { b.classList.remove('active'); });
    button.classList.add('active');
    items.forEach(function (item) {
      item.hidden = !(cat === 'all' || item.dataset.cat === cat);
    });
  });
});

// 4. the big view (lightbox)
const box   = document.querySelector('.lightbox');
const img   = box.querySelector('.lb-img');
const title = box.querySelector('.lb-title');
const note  = box.querySelector('.lb-note');
const place = box.querySelector('.lb-place');
let current = 0;

function visibleItems() {
  return items.filter(function (item) { return !item.hidden; });
}

function open(item) {
  const list = visibleItems();
  current = list.indexOf(item);
  img.src = item.querySelector('img').src;
  img.alt = item.querySelector('img').alt;
  title.innerHTML = item.querySelector('.item-title').innerHTML;
  note.innerHTML  = item.querySelector('.item-note').innerHTML;
  place.textContent = item.querySelector('.item-place').textContent;
  box.hidden = false;
  document.body.style.overflow = 'hidden';   // stop the page scrolling behind
}

function close() {
  box.hidden = true;
  document.body.style.overflow = '';
}

function step(direction) {
  const list = visibleItems();
  current = (current + direction + list.length) % list.length;
  open(list[current]);
}

items.forEach(function (item) {
  item.addEventListener('click', function () { open(item); });
});

box.querySelector('.lb-close').addEventListener('click', close);
box.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
box.querySelector('.lb-next').addEventListener('click', function () { step(1); });

// click the dark background to close
box.addEventListener('click', function (evt) {
  if (evt.target === box) close();
});

// keyboard: Esc closes, arrows go back and forward
document.addEventListener('keydown', function (evt) {
  if (box.hidden) return;
  if (evt.key === 'Escape') close();
  if (evt.key === 'ArrowLeft') step(-1);
  if (evt.key === 'ArrowRight') step(1);
});
