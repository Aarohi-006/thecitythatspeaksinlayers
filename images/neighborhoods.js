/* ===================== NEIGHBORHOOD MAP ===================== */

const pins  = document.querySelectorAll('.pin');
const cards = document.querySelectorAll('.hood');

pins.forEach(function (pin) {
  pin.addEventListener('click', function () {

    // 1. hide every card, un-highlight every pin
    cards.forEach(function (card) { card.classList.remove('show'); });
    pins.forEach(function (p) { p.classList.remove('active'); });

    // 2. show the card that matches this pin (data-hood="soho" -> id="soho")
    const card = document.getElementById(pin.dataset.hood);
    card.classList.add('show');
    pin.classList.add('active');
  });
});
