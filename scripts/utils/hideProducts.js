import { getFinalPrice, getTotalCount } from "../components/cart.js";
import { chooseWordForm } from "./chooseWordForm.js";
import { formatNumber } from "./formatNumber.js";

export function hideProducts(button, elementToHide) {
    const countElement = document.querySelector('.items-count');
    const priceElement = document.querySelector('.items-price');

    countElement.textContent = getTotalCount() + ` ${chooseWordForm(getTotalCount(), ['товар', 'товара', 'товаров'])} · `;
    priceElement.textContent = formatNumber(getFinalPrice(), ' ') + ' сом';

    elementToHide.classList.toggle('hidden');
    button.classList.toggle('hidden');
}
