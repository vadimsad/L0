import handleOrderSubmit, { handleImmediatePaymentChange } from './components/orderForm.js'
import { positionTooltip } from './components/tooltip.js';
import { hideProducts } from './utils/hideProducts.js';
import { throttle } from './utils/throttle.js';
import { handleItnInputChange, handleTelInputChange, validateInput } from './utils/validation.js';

const orderForm = document.querySelector('#make-order-form');
const recepientForm = document.querySelector('#recepient-data');

orderForm.addEventListener('submit', (event) => handleOrderSubmit(event, recepientForm));

recepientForm.querySelectorAll('input').forEach(input => {
    input.onblur = () => {
        if (!input.value) return;

        input.oninput = () => validateInput(input);

        validateInput(input);
    }

    if (input.id === 'tel') {
        input.addEventListener('input', () => handleTelInputChange(input));
    } else if (input.id === 'itn') {
        input.addEventListener('input', () => handleItnInputChange(input));
    }
})

const tooltips = document.querySelectorAll(".tooltip-trigger");

const positionTooltipThrottled = throttle(positionTooltip, 50);

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener("scroll", function () {
        tooltips.forEach(positionTooltipThrottled);
    });

    window.addEventListener("resize", function () {
        tooltips.forEach(positionTooltipThrottled);
    });
})


// ПЕРЕДЕЛАТЬ ЭТО, чтобы получать цену не из html, а из js модели

const submitButton = orderForm.querySelector('button[type="submit"]');
const totalPrice = orderForm.querySelector('#price-total').textContent;
const immediatePaymentCheckbox = orderForm.querySelector('#immediate-payment');
const immediatePaymentDescription = orderForm.querySelector('.main__payment-term-description');

immediatePaymentCheckbox.addEventListener('change', () => handleImmediatePaymentChange(immediatePaymentCheckbox, submitButton, totalPrice, immediatePaymentDescription));






const hideButtons = document.querySelectorAll('.cart__controls-show');

hideButtons.forEach(button => {
    const productsBlock = button.closest('.cart__controls').nextElementSibling;
    button.addEventListener('click', () => hideProducts(button, productsBlock))
})