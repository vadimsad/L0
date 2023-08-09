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

export function deleteShippingItem(event) {
    const item = event.target.closest('.delivery-dialog__address');
    const siblingItem = item.nextElementSibling || item.previousElementSibling;

    if (siblingItem && siblingItem.classList.contains('delivery-dialog__address')) {
        item.remove();
        
        if (item.querySelector('input').checked) {
            siblingItem.querySelector('input').checked = true;
        }
    }
}

function fixPageScroll() {
    scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
    html.classList.add("modal-shown");
}