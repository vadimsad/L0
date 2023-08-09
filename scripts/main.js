import { changePayment, changeShippingAddress, decreaseCount, deleteProduct, handleCountChange, handleCountInput, increaseCount, toggleFavorite, toggleProduct } from './components/cart.js';
import { deleteShippingItem, hideModal, showModal, unfixPageScroll } from './components/modal.js';
import handleOrderSubmit, { handleImmediatePaymentChange } from './components/orderForm.js'
import { handleTabChange } from './components/tabs.js';
import { positionTooltip } from './components/tooltip.js';
import { hideProducts } from './utils/hideProducts.js';
import { throttle } from './utils/throttle.js';
import { handleTelInputChange, validateInput } from './utils/validation.js';

// Элементы формы
const orderForm = document.querySelector('#make-order-form');
const recepientForm = document.querySelector('#recepient-data');
const submitButton = orderForm.querySelector('button[type="submit"]');
const totalPrice = orderForm.querySelector('#price-total').textContent;
const immediatePaymentCheckbox = orderForm.querySelector('#immediate-payment');
const immediatePaymentDescription = orderForm.querySelector('.main__payment-term-description');

// Событие отправки формы заказа
orderForm.addEventListener('submit', (event) => handleOrderSubmit(event, recepientForm));

// Валидация полей формы получателя
recepientForm.querySelectorAll('input').forEach(input => {
    input.onblur = () => {
        if (!input.value) return;
        input.oninput = () => validateInput(input);
        validateInput(input);
    }
    if (input.id === 'tel') {
        input.addEventListener('input', () => handleTelInputChange(input));
    }
});

// Позиционирование подсказок
const tooltips = document.querySelectorAll(".tooltip-trigger");
const positionTooltipThrottled = throttle(positionTooltip, 50);

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener("scroll", () => tooltips.forEach(positionTooltipThrottled));
    window.addEventListener("resize", () => tooltips.forEach(positionTooltipThrottled));
});

// Обработка чекбокса немедленной оплаты
immediatePaymentCheckbox.addEventListener('change', () =>
    handleImmediatePaymentChange(immediatePaymentCheckbox, submitButton, totalPrice, immediatePaymentDescription));

// Скрытие товаров
const hideButtons = document.querySelectorAll('.cart__controls-show');
hideButtons.forEach(button => {
    const productsBlock = button.closest('.cart__controls').nextElementSibling;
    button.addEventListener('click', () => hideProducts(button, productsBlock))
});

// Модальные окна
const modalTriggers = document.querySelectorAll('[data-modal]');
modalTriggers.forEach(modalTrigger => modalTrigger.onclick = showModal);

const modalCloseButtons = document.querySelectorAll('#modal-close');
modalCloseButtons.forEach(button => button.onclick = hideModal);

const dialogs = document.querySelectorAll('dialog');
dialogs.forEach(dialog => {
    const dialogWrapper = dialog.querySelector('.dialog__wrapper');
    dialogWrapper.addEventListener('click', (e) => e.stopPropagation());
    dialog.addEventListener('click', hideModal);
    dialog.addEventListener('close', unfixPageScroll);
});

const shippingDeleteButtons = document.querySelectorAll('.delivery__delete');
shippingDeleteButtons.forEach(button => button.addEventListener('click', deleteShippingItem))

// Переключение вкладок
const tabs = document.querySelectorAll('input[name="tab"]');
tabs.forEach(tab => tab.onchange = handleTabChange);

// Выбор товара
const products = document.querySelectorAll('.cart__items .item');
products.forEach(product => {
    const productInput = product.querySelector('.input-checkbox');
    productInput.addEventListener('change', () => toggleProduct(product))
})

const selectAllButton = document.querySelector('.cart #select-all');
selectAllButton.addEventListener('change', () => {
    const isChecked = selectAllButton.checked;

    if (isChecked) {
        products.forEach(product => {
            const productInput = product.querySelector('.input-checkbox');

            if (productInput.checked) return;

            productInput.checked = true;
            toggleProduct(product, true)
        });
    } else {
        products.forEach(product => {
            const productInput = product.querySelector('.input-checkbox');

            if (!productInput.checked) return;

            productInput.checked = false;
            toggleProduct(product, false)
        });
    }
})

// Изменение количества товара
const counters = document.querySelectorAll('.item__counter');
counters.forEach(counter => {
    const input = counter.querySelector('input.item__counter-input');
    const minusButton = counter.querySelector('.item__counter-minus');
    const plusButton = counter.querySelector('.item__counter-plus');

    input.oninput = handleCountInput;
    input.onchange = handleCountChange;
    minusButton.onclick = decreaseCount;
    plusButton.onclick = increaseCount;
})

// Добавление товаров в избранное
const favoriteButtons = document.querySelectorAll('.control-buttons__favorite');
favoriteButtons.forEach(button => button.addEventListener('click', toggleFavorite))

// Удаление товаров
const deleteButtons = document.querySelectorAll('.control-buttons__delete');
deleteButtons.forEach(button => button.addEventListener('click', deleteProduct))

// Изменение адреса доставки
const shippingForm = document.querySelector('.delivery-dialog__form');
shippingForm.addEventListener('submit', changeShippingAddress);

// Изменение способа оплаты
const paymentForm = document.querySelector('.payment-dialog form');
paymentForm.addEventListener('submit', changePayment);