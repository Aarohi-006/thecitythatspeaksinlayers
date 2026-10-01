
const stickers = document.querySelectorAll('.sticker');

stickers.forEach(function (sticker) {
  const img = sticker.querySelector('img');

 
  const slot = document.createElement('span');
  slot.className = 'slot';

  const ghost = document.createElement('span');
  ghost.className = 'ghost';

  const peel = document.createElement('span');
  peel.className = 'peel';

  const back = document.createElement('span');
  back.className = 'peel-back';

 
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
      window.location.href = sticker.href; 
    }, 700);                             
  });
});


window.addEventListener('pageshow', function () {
  stickers.forEach(function (sticker) {
    sticker.classList.remove('peeled');
  });
});
