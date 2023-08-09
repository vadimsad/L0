import { cartState, changeShippingAddress } from "./cart.js";

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
    const input = item.querySelector('.input-radio');
    const isCurrentItem = input.checked;
    const siblingItem = item.nextElementSibling || item.previousElementSibling;

    if (siblingItem && !isCurrentItem) {
        item.remove();
        
        // if (item.querySelector('input').checked) {
        //     siblingItem.querySelector('input').checked = true;
        // }
    }
}

export function resetShippingInput(event) {
    const dialog = event.target;
    const checkedInput = dialog.querySelector('input.input-radio:checked');
    const isWrongInputChecked = checkedInput.id !== cartState.shipping.id;
    const correctInput = dialog.querySelector(`input#${cartState.shipping.id}`);

    if (isWrongInputChecked) {
        if (correctInput) {
            checkedInput.checked = false;
            dialog.querySelector(`input#${cartState.shipping.id}`).checked = true;
        } else {
            changeShippingAddress(checkedInput);
        }
    }
}

function fixPageScroll() {
    scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
    html.classList.add("modal-shown");
}