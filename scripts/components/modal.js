let html = document.documentElement;
let scrollPosition = window.pageYOffset;

export function showModal(event) {
    const button = event.currentTarget
    const modalID = button.dataset.modal;
    const modal = document.getElementById(modalID);

    if (modal) {
        modal.showModal();
    }

    fixPageScroll();
}

export function hideModal(event) {
    const button = event.currentTarget;
    const modal = button.closest('dialog');

    if (modal) {
        modal.close();
    }
}

export function unfixPageScroll() {
    html.classList.remove("modal-shown");
    window.scrollTo(0, scrollPosition);
    html.style.top = "";
}

function fixPageScroll() {
    scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
    html.classList.add("modal-shown");
}