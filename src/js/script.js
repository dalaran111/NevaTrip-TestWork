const TIMESTAMPS_LIMITED_CLASS = 'card__time_limited';

const pricesMain = document.querySelectorAll('.cards__prices-main'),
      pricesPier = document.querySelectorAll('.cards__prices-pier'),
      yellowSticker = document.querySelector('.yellow__sticker'),
      noneSticker = document.querySelector('.none__sticker');

function priceChanger() {
    if (window.innerWidth > 768) {
        pricesMain.forEach(e => {
            e.textContent = "900 \u20bd";
        });
        pricesPier.forEach(e => {
            e.textContent = "1200 \u20bd на причале";
        });
    }
}
function stickerChanger() {
    if (window.innerWidth > 992) {
        yellowSticker.childNodes[0].textContent = "КРУГЛЫЙ ГОД";
        noneSticker.style.display = "none";
    }
}


window.addEventListener("resize", priceChanger, "once");
window.addEventListener("resize", stickerChanger, "once");
window.addEventListener("load", priceChanger);
window.addEventListener("load", stickerChanger);

initMoreBtns();

function initMoreBtns() {
    document.querySelectorAll('.cards__more-btn').forEach(moreBtnEl => {
        moreBtnEl.addEventListener('click', () => {
            const cardId = moreBtnEl.getAttribute('data-id');
            const timeEl = document.querySelector(`#card-${cardId} .cards__time`);
            if (timeEl.classList.contains(TIMESTAMPS_LIMITED_CLASS)) {
                timeEl.classList.remove(TIMESTAMPS_LIMITED_CLASS);
            } else {
                timeEl.classList.add(TIMESTAMPS_LIMITED_CLASS);
            }
        });
    });
}
