import { getFinalPrice, getTotalCount } from "../components/cart.js";
import { chooseWordForm } from "./chooseWordForm.js";
import { formatNumber } from "./formatNumber.js";

export function hideProducts(button, elementToHide) {
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
