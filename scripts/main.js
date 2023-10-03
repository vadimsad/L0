import { changePayment, changeShippingAddressCallback, decreaseCount, deleteProduct, getFinalPrice, getTotalCount, handleCountChange, handleCountInput, increaseCount, toggleFavorite, toggleProduct } from './components/cart.js';
import { deleteShippingItem, hideModal, resetPaymentInput, resetShippingInput, showModal, unfixPageScroll, handleTabChange } from './components/modal.js';
import handleOrderSubmit, { handleImmediatePaymentChange } from './components/orderForm.js'
import { createDiscountTooltip, positionTooltip } from './components/tooltip.js';
import { chooseWordForm } from './utils/chooseWordForm.js';
import { formatNumber } from './utils/formatNumber.js';
import { throttle } from './utils/throttle.js';
import { handleTelInputChange, validateInput } from './utils/validation.js';

// Элементы формы
const orderForm = document.querySelector('#make-order-form');
const recepientForm = document.querySelector('#recepient-data');
const submitButton = orderForm.querySelector('button[type="submit"]');
const totalPriceBlock = orderForm.querySelector('#price-total');
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
    handleImmediatePaymentChange(immediatePaymentCheckbox, submitButton, totalPriceBlock, immediatePaymentDescription));

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

const shippingDialog = document.querySelector('.delivery-dialog.dialog');
shippingDialog.addEventListener('close', resetShippingInput)

const paymentDialog = document.querySelector('.payment-dialog.dialog');
paymentDialog.addEventListener('close', resetPaymentInput)

const shippingDeleteButtons = document.querySelectorAll('.delivery__delete');
shippingDeleteButtons.forEach(button => button.addEventListener('click', deleteShippingItem))

// Переключение вкладок в модальном окне доставки
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
shippingForm.addEventListener('submit', changeShippingAddressCallback);

// Изменение способа оплаты
const paymentForm = document.querySelector('.payment-dialog form');
paymentForm.addEventListener('submit', changePayment);

// Рассчитываем величину скидки для каждого товара
document.addEventListener('DOMContentLoaded', () => {
    const discountTooltips = document.querySelectorAll('.item__sum-discountless .tooltip');
    discountTooltips.forEach(createDiscountTooltip)
})

function hideProducts(button, elementToHide) {
    console.log('hide products')
    const label = button.closest('.cart__controls').querySelector('label');
    const countBlock = button.closest('.cart__controls').querySelector('.cart__controls-items-count');
    const countElement = document.querySelector('.items-count');
    const priceElement = document.querySelector('.items-price');

    elementToHide.classList.toggle('hidden');
    button.classList.toggle('hidden');
    if (label && countBlock) {
        label.classList.toggle('hidden');
        countBlock.classList.toggle('hidden');
    }

    if (elementToHide.classList.contains('hidden')) {
        elementToHide.classList.add('overflow-hidden');
        elementToHide.addEventListener('transitionend', resetOverflow);
    } else {
        elementToHide.removeEventListener('transitionend', resetOverflow);
    }

    updateProductInfo(countElement, priceElement);

    function resetOverflow(event) {
        if (event.propertyName !== 'grid-template-rows') return;

        if (!elementToHide.classList.contains('hidden')) {
            elementToHide.classList.remove('overflow-hidden')
        }
    }
}

function updateProductInfo(countElement, priceElement) {
    countElement.textContent = `${getTotalCount()} ${chooseWordForm(getTotalCount(), ['товар', 'товара', 'товаров'])} · `;
    priceElement.textContent = `${formatNumber(getFinalPrice(), ' ')} сом`;
}