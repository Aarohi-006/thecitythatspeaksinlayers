/* ===================== PEEL EFFECT ===================== */

// find every sticker on the page
const stickers = document.querySelectorAll('.sticker');

stickers.forEach(function (sticker) {
  const img = sticker.querySelector('img');

  // 1. build the layers around the image:
  //    slot  > ghost (mark left behind)
  //          > peel  > img (front) + peel-back (white back)
  const slot = document.createElement('span');
  slot.className = 'slot';

  const ghost = document.createElement('span');
  ghost.className = 'ghost';

  const peel = document.createElement('span');
  peel.className = 'peel';

  const back = document.createElement('span');
  back.className = 'peel-back';

  // the back and the ghost use the sticker's own shape
  slot.style.setProperty('--shape', 'url("' + img.getAttribute('src') + '")');

  img.replaceWith(slot);
  peel.append(img, back);
  slot.append(ghost, peel);

  // 2. on click: peel the sticker, then open its page
  sticker.addEventListener('click', function (event) {
    event.preventDefault();               // don't jump to the page yet

    if (sticker.classList.contains('peeled')) return;
    sticker.classList.add('peeled');      // starts the CSS peel animation

    setTimeout(function () {
      window.location.href = sticker.href; // go to the page after the peel
    }, 700);                               // 700ms = length of the animation
  });
});

// 3. if someone comes back with the Back button, put the stickers back down
window.addEventListener('pageshow', function () {
  stickers.forEach(function (sticker) {
    sticker.classList.remove('peeled');
  });
});
