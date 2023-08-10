import { changeShippingAddress } from "./cart.js";
import { cartState } from '../model.js';

// Получение корневого элемента HTML и позиции прокрутки страницы
const html = document.documentElement;
let scrollPosition = window.pageYOffset;

// Открытие модального окна
export function showModal(event) {
    const button = event.currentTarget;
    const modalID = button.dataset.modal;
    const modal = document.getElementById(modalID);

    if (modal) {
        modal.showModal();
        fixPageScroll();
    }
}

// Закрытие модального окна
export function hideModal(event) {
    const button = event.currentTarget;
    const modal = button.closest('dialog');

    if (modal) {
        modal.close();
    }
}

// Восстановление прокрутки страницы после закрытия модального окна
export function unfixPageScroll() {
    html.classList.remove("modal-shown");
    window.scrollTo(0, scrollPosition);
    html.style.top = "";
}

// Удаление элемента доставки
export function deleteShippingItem(event) {
    const item = event.target.closest('.delivery-dialog__address');
    const input = item.querySelector('.input-radio');
    const isCurrentItem = input.checked;
    const siblingItem = item.nextElementSibling || item.previousElementSibling;

    if (siblingItem && !isCurrentItem) {
        item.remove();
    }
}

// Сброс выбора способа доставки при закрыти модального окна
export function resetShippingInput(event) {
    const dialog = event.target;
    const checkedInput = dialog.querySelector('input.input-radio:checked');
    const isWrongInputChecked = checkedInput.id !== cartState.shipping.id;
    const correctInput = dialog.querySelector(`input#${cartState.shipping.id}`);

    if (isWrongInputChecked) {
        if (correctInput) {
            checkedInput.checked = false;
            correctInput.checked = true;
        } else {
            changeShippingAddress(checkedInput);
        }
    }
}

// Сброс выбора способа оплаты при закрытии модального окна
export function resetPaymentInput(event) {
    const dialog = event.target;
    const checkedInput = dialog.querySelector('input.input-radio:checked');
    const isWrongInputChecked = checkedInput.id !== cartState.payment.id;
    const correctInput = dialog.querySelector(`input#${cartState.payment.id}`);

    if (isWrongInputChecked) {
        checkedInput.checked = false;
        correctInput.checked = true;
    }
}

// Функция для переключения вкладок в модальном окне
export function handleTabChange(event) {
    const labels = event.target.closest('.delivery-dialog__tabs').querySelectorAll('label');
    const tabsContent = document.querySelectorAll('.delivery-dialog-addresses');
    
    tabsContent.forEach(content => content.classList.toggle('hidden'));
    labels.forEach(label => label.classList.toggle('active'))
}

// Фиксация прокрутки страницы при открытии модального окна
function fixPageScroll() {
    scrollPosition = window.pageYOffset;
    html.style.top = -scrollPosition + "px";
    html.classList.add("modal-shown");
}
