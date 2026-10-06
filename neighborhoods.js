/* ===================== NEIGHBORHOOD MAP ===================== */

// everything you can click: the pins on the map and the names under it
const buttons = document.querySelectorAll('.pin, .hood-name');
const cards   = document.querySelectorAll('.hood');

function show(id) {
  // 1. hide every card, un-highlight every pin and name
  cards.forEach(function (card) { card.classList.remove('show'); });
  buttons.forEach(function (b) { b.classList.remove('active'); });

  // 2. show the card that matches (data-hood="soho" -> id="soho")
  document.getElementById(id).classList.add('show');
  document.querySelectorAll('[data-hood="' + id + '"]').forEach(function (b) {
    b.classList.add('active');
  });
}

buttons.forEach(function (b) {
  b.addEventListener('click', function () { show(b.dataset.hood); });
});
