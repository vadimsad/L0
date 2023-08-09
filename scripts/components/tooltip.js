import { cartState } from "./cart.js";

export function positionTooltip(tooltipTrigger) {
    const tooltip = tooltipTrigger.closest('.tooltip-wrapper').querySelector('.tooltip');
    const tooltipHeight = tooltip.getBoundingClientRect().height;
    const tooltipTriggerRect = tooltipTrigger.getBoundingClientRect();

    const distanceToBottom = window.innerHeight - (tooltipTriggerRect.top + tooltipTriggerRect.height);

    tooltip.classList.toggle("tooltip-top", distanceToBottom < tooltipHeight);
}

export function createDiscountTooltip(tooltip) {
    const productID = tooltip.closest('.cart__item').dataset.id;
    const product = cartState.products.find(product => product.id == productID);

    const productPrice = product.price.original;
    const discounts = product.discounts;

    const discountBlocks = discounts.map(discount => {
        return (
            `
            <div class="text-13">
                <dt>${discount.name}</dt>
                <dd>−${Math.round(productPrice * discount.value)} сом</dd>
            </div>
            `
        )
    }).join('');

    tooltip.querySelector('dl').innerHTML = discountBlocks;
}