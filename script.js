/* Based on the script from "Sticker Peel CSS Effect v2" by bsehovac
   https://codepen.io/bsehovac/pen/gvejKK
   Added: each sticker opens its page after it peels. */

const stickers = document.querySelector('#stickers');
const cells = stickers.querySelectorAll('.sticker-cell');

if ('ontouchstart' in window) {

  // PHONES: first tap peels the sticker, second tap opens the page
  stickers.classList.add('touch');

  for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = function (event) {
      const sticker = this.querySelector('.sticker');

      if (!sticker.classList.contains('peeled')) {
        event.preventDefault();                 // don't open the page yet
        for (let j = 0; j < cells.length; j++) {
          cells[j].querySelector('.sticker').classList.remove('peeled');
        }
        sticker.classList.add('peeled');
      }
      // if it is already peeled, the link opens normally
    };
  }

} else {

  // COMPUTERS: hovering peels the sticker (CSS), clicking opens the page
  stickers.classList.add('hover');

  for (let i = 0; i < cells.length; i++) {
    cells[i].onclick = function (event) {
      event.preventDefault();
      const link = this.href;
      this.querySelector('.sticker').classList.add('peeled');
      setTimeout(function () {
        window.location.href = link;            // open the page after a short pause
      }, 350);
    };
  }

}
