import { chooseWordForm } from "../utils/chooseWordForm.js";
import { formatNumber } from "../utils/formatNumber.js";

const DEFAULT_WORKTIME = 'Ежедневно с 10 до 21';
const DEFAULT_RATING = 5.00;
const DEFAULT_CARD_EXPIRY = '01/42';

const cartState = {
    products: [
        {
            id: 1,
            title: 'Футболка UZcotton мужская',
            price: {
                discounted: 522,
                original: 1051
            },
            properties: {
                'Цвет': 'белый',
                'Размер': '56',
            },
            location: 'Коледино WB',
            supplier: {
                title: 'OOO «Вайлдберриз»',
                PSRNSP: '1067746062449',
                address: '142181, Московская область, Г.О. ПОДОЛЬСК, Д КОЛЕДИНО, ТЕР. ИНДУСТРИАЛЬНЫЙ ПАРК КОЛЕДИНО, Д. 6, СТР. 1',
            },
            shippingSchedule: [
                {
                    date: '5—6 февраля',
                    maxQuantity: 2
                }
            ],
            stock: 2,
            count: 1,
            isSelected: true,
            isFavorite: false,
            imageSource: '../../assets/images/product-image-1.png',
        },
        {
            id: 2,
            title: 'Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe',
            price: {
                discounted: 10500,
                original: 11500,
            },
            properties: {
                'Цвет': 'прозрачный',
            },
            location: 'Коледино WB',
            supplier: {
                title: 'OOO «МЕГАПРОФСТИЛЬ»',
                PSRNSP: '5167746237148',
                address: '129337, Москва, улица Красная Сосна, 2, корпус 1, стр. 1, помещение 2, офис 34',
            },
            shippingSchedule: [
                {
                    date: '5—6 февраля',
                    maxQuantity: 184
                },
                {
                    date: '7—8 февраля',
                    maxQuantity: 200
                },
                {
                    date: '9—10 февраля',
                    maxQuantity: 616
                },
            ],
            stock: 1000,
            count: 200,
            isSelected: true,
            isFavorite: false,
            imageSource: '../../assets/images/product-image-2.png',
        },
        {
            id: 3,
            title: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные, Faber-Castell ',
            price: {
                discounted: 247,
                original: 475
            },
            properties: {},
            location: 'Коледино WB',
            supplier: {
                title: 'OOO Вайлдберриз',
                PSRNSP: '1067746062449',
                address: '142181, Московская область, Г.О. ПОДОЛЬСК, Д КОЛЕДИНО, ТЕР. ИНДУСТРИАЛЬНЫЙ ПАРК КОЛЕДИНО, Д. 6, СТР. 1',
            },
            shippingSchedule: [
                {
                    date: '5—6 февраля',
                    maxQuantity: 2
                }
            ],
            stock: 2,
            count: 2,
            isSelected: true,
            isFavorite: false,
            imageSource: '../../assets/images/product-image-3.png',
        },
    ],
    selectedIds: [1, 2, 3],
    shipping: {
        type: 'pickup',
        address: 'Бишкек, улица Ахматбека Суюмбаева, 12/1',
        rating: 4.99,
        wortTime: 'Ежедневно с 10 до 21',
    },
    payment: {
        cardNumber: '1234 56•• •••• 1234',
        cardExpiry: '01/30',
        imageSource: './assets/icons/mir.svg',
    }
};

const selectAllButton = document.querySelector('.cart #select-all');

export function toggleProduct(product, selectMode) {
    const productID = product.dataset.id;
    const productState = cartState.products.find(product => product.id == productID);

    if (!productState) return;

    if (selectMode === undefined) {
        const newState = !productState.isSelected;
        productState.isSelected = newState;

        if (newState) {
            selectProduct(productID);
        } else {
            deselectProduct(productID);
        }

    } else {
        if (selectMode) {
            productState.isSelected = true;
            selectProduct(productID);
        } else {
            productState.isSelected = false;
            deselectProduct(productID);
        }
    }
   
    handleSelectAllInput(selectAllButton);
    updateShippingDate();
    updateTotalPrice();
}

export function handleCountInput(event) {
    const input = event.target;
    const maxValueLength = parseInt(input.getAttribute('maxlength')) || 3;
    const inputValue = input.value;
  
    const sanitizedValue = inputValue.replace(/\D/g, '');
    const trimmedValue = sanitizedValue.slice(0, maxValueLength);

    input.value = trimmedValue;
}

export function handleCountChange(event) {
    const productID = event.target.closest('.cart__item.item').dataset.id;
    const maxValue = cartState.products.find(product => product.id == productID)?.stock || Infinity;

    if (event.target.value == '' || event.target.value == 0) {
        event.target.value = 1;
    } else if (event.target.value > maxValue) {
        event.target.value = maxValue;
    } else {
        event.target.value = parseInt(event.target.value);
    }

    changeProductCount(productID, event.target.value);
}

export function toggleFavorite(event) {
    const productElement = event.target.closest('.cart__item.item');
    const productID = productElement.dataset.id;
    const product = cartState.products.find(product => product.id == productID);
    const button = event.currentTarget;

    if (productID) {
        product.isFavorite = !product.isFavorite;
    }

    button.classList.toggle('active');
}

export function deleteProduct(event) {
    const productElement = event.target.closest('.cart__item.item');
    const productID = productElement.dataset.id;

    if (productID) {
        cartState.products = cartState.products.filter(product => product.id != productID);

        deselectProduct(productID);
        updateTotalPrice();
        updateShippingDate();
        updateCartLabels();
    } else {
        const missingTitleElement = document.querySelector('#missing-title');
        const missingNumberElement = document.querySelector('#missing-number');
        const missingTextElement = document.querySelector('#missing-text');
        const currentNumber = missingNumberElement.textContent;
        const newNumber = currentNumber - 1;
        
        missingTitleElement.textContent = chooseWordForm(newNumber, ['Отсутствует', 'Отсутствуют', 'Отсутствуют']);
        missingNumberElement.textContent = newNumber;
        missingTextElement.textContent = chooseWordForm(newNumber, ['товар', 'товара', 'товаров']);
    }

    productElement.remove();
}

export function changePayment(event) {
    event.preventDefault();

    const dialog = event.target.closest('dialog');
    const newCardNumber = event.target.querySelector('input:checked ~ .payment-info .payment-info__number').textContent;
    const newCardExpiry = event.target.querySelector('input:checked').dataset.expiry || DEFAULT_CARD_EXPIRY;
    const newImage = event.target.querySelector('input:checked ~ .payment-info .payment-info__logo img').getAttribute('src');

    cartState.payment.cardNumber = newCardNumber;
    cartState.payment.cardExpiry = newCardExpiry;
    cartState.payment.imageSource = newImage;
    updatePaymentInfo();
    dialog.close();
}

function updatePaymentInfo() {
    const paymentImageMain = document.querySelector('.main__payment-method-logo img');
    const paymentImage = document.querySelector('.cart__payment-method-logo img');
    const paymentCardNumberMain = document.querySelector('.main__payment-method-number');
    const paymentCardNumber = document.querySelector('.cart__payment-method-number');
    const paymentCardExpiry = document.querySelector('.cart__payment-method-expiry');

    paymentImageMain.src = cartState.payment.imageSource;
    paymentImage.src = cartState.payment.imageSource;
    paymentCardNumberMain.textContent = cartState.payment.cardNumber;
    paymentCardNumber.textContent = cartState.payment.cardNumber;
    paymentCardExpiry.textContent = cartState.payment.cardExpiry;
}

export function changeShippingAddress(event) {
    event.preventDefault();

    const dialog = event.target.closest('dialog');
    const newType = event.target.querySelector('input:checked').dataset.type;
    const newAddress = event.target.querySelector('input:checked ~ p.text-16').textContent;
    const newRating = event.target.querySelector('input:checked ~ .delivery-dialog__address-description .rating')?.textContent || DEFAULT_RATING;
    const newWorkTime = DEFAULT_WORKTIME;
    
    cartState.shipping = {type: newType, address: newAddress, rating: newRating, workTime: newWorkTime};
    updateShippingInfo();
    dialog.close();
}

function updateShippingInfo() {
    const addressElement = document.querySelector('.main__shipping-address');
    const shippingInfo = document.querySelector('.shipping-info__block-address');
    const shippingInfoType = shippingInfo.querySelector('dt');
    const shippingInfoAddress = shippingInfo.querySelector('dd p');
    const shippingInfoRating = shippingInfo.querySelector('.shipping-info__rating');
    const shippingInfoWorkTime = shippingInfo.querySelector('.shipping-info__worktime');

    addressElement.textContent = cartState.shipping.address;
    
    switch (cartState.shipping.type) {
        case 'pickup': {
            shippingInfoType.textContent = 'Пункт выдачи';
            break;
        }
        case 'courier': {
            shippingInfoType.textContent = 'Доставит курьер';
            break;
        }
    }

    shippingInfoRating.textContent = cartState.shipping.rating;
    shippingInfoAddress.textContent = cartState.shipping.address;
    shippingInfoWorkTime.textContent = cartState.shipping.workTime;
}

function changeCount(event, increment) {
    const id = event.target.closest('.cart__item.item').dataset.id;
    const input = event.target.closest('.item__counter').querySelector('.item__counter-input');
    const currentValue = parseInt(input.value);
    const minValue = parseInt(input.getAttribute('min')) || 1;
    const maxValue = cartState.products.find(product => product.id == id)?.stock || Infinity;
    const maxValueLength = parseInt(input.getAttribute('maxlength')) || 3;
    
    const newValue = increment ? currentValue + 1 : currentValue - 1;
    if (newValue >= minValue && newValue.toString().length <= maxValueLength && newValue <= maxValue) {
        input.value = newValue;
        const productID = input.closest('.cart__item.item').dataset.id;
        changeProductCount(productID, newValue);
    }
}

export function increaseCount(event) {
    changeCount(event, true);
}

export function decreaseCount(event) {
    changeCount(event, false);
}

function updateShippingDate() {
    const productsToShip = cartState.products.map(({isSelected, id, count, shippingSchedule}) => {
        if (isSelected) {
            return {id, count, shippingSchedule}
        }
    }).filter(product => product !== undefined);
    
    const dates = new Map();
    productsToShip.forEach((product) => calculateShippingDates(product, dates));

    document.querySelectorAll('.shipping-info__block.shipping-info__block--products').forEach(node => node.remove());
    const shippingBlockParent = document.querySelector('.cart__shipping-info.shipping-info dl');

    dates.forEach((products, date) => {
        const productsBlock = products.map(product => {
            return (
                `
                <div class="shipping-info__product" data-id="${product.id}">
                    <a href="#">
                        <img src="./assets/images/product-image-${product.id}.png" alt="Изображение">
                        ${product.count > 1 ? `<div class="shipping-info__product-label item-label">${product.count}</div>` : ''}
                    </a>
                </div>
                `
            )
        }).join('');
        const shippingBlock = 
        `
        <div class="shipping-info__block shipping-info__block--products">
            <dt class="text-16 weight-600">
                ${date}
            </dt>
            <dd>
                <div class="shipping-info__products">
                    ${productsBlock}
                </div>
            </dd>
        </div>
        `;

        shippingBlockParent.insertAdjacentHTML('beforeend', shippingBlock);
    })

    updateShipmentDateInForm(dates);
}

function updateShipmentDateInForm(dates) {
    const datesString = Array.from(dates);

    if (datesString.length === 0) {
        document.querySelector('.main__shipping-date').textContent = '';
        return;
    }

    const minDate = Math.min(...datesString[0][0].match(/\d/g));
    const maxDate = Math.max(...datesString[datesString.length - 1][0].match(/\d/g));
    const month = datesString[0][0].match(/[a-zA-Zа-яА-Я]/g).slice(0,3).join('');
    
    document.querySelector('.main__shipping-date').textContent = `${minDate}-${maxDate} ${month}`;
}

function calculateShippingDates({id, count, shippingSchedule}, dates) {
    let productsToShip = count;

    for (let i = 0; i < shippingSchedule.length; i++) {
        const shipping = shippingSchedule[i];

        if (productsToShip <= shipping.maxQuantity) {
            const shippingInfo = {
                id,
                count: productsToShip,
            };

            if (dates.has(shipping.date)) {
                dates.set(shipping.date, [...dates.get(shipping.date), shippingInfo])
            } else {
                dates.set(shipping.date, [shippingInfo])
            }

            break;
        } else {
            const shippingInfo = {
                id,
                count: shipping.maxQuantity,
            };

            if (dates.has(shipping.date)) {
                dates.set(shipping.date, [...dates.get(shipping.date), shippingInfo])
            } else {
                dates.set(shipping.date, [shippingInfo])
            }

            productsToShip = count - shipping.maxQuantity;
        }
    }
}

function updateCartLabels() {
    const cartLabel = document.querySelector('.header__link_cart-label.item-label');
    const cartLabelMobile = document.querySelector('.footer__menu-link-label.item-label');
    const productsRemains = cartState.products.length;

    cartLabel.textContent = productsRemains;
    cartLabelMobile.textContent = productsRemains;
}

function updateTotalPrice() {
    const totalPriceElement = document.querySelector('.main__total-prices-value #price-total');
    const totalCountElement = document.querySelector('.main__total-price #goods-count');
    const totalCountTextElement = document.querySelector('.main__total-price #goods-text');
    const priceOriginalElement = document.querySelector('.main__total-prices-value #price-discountless');
    const priceDiscountElement = document.querySelector('.main__total-prices-value #price-discount');

    const selectedProducts = cartState.products.filter(product => product.isSelected);

    if (selectedProducts.length > 0) {
        const totalDiscountedPrice = selectedProducts.reduce((acc, {price: {discounted}, count}) => {
            return acc += discounted * count;
        }, 0);
        const totalOriginalPrice = selectedProducts.reduce((acc, {price: {original}, count}) => {
            return acc += original * count;
        }, 0);
        const totalCount = selectedProducts.reduce((acc, {count}) => {
            return acc += +count;
        }, 0)
        const discount = totalDiscountedPrice - totalOriginalPrice;

        totalPriceElement.textContent = formatNumber(totalDiscountedPrice);
        totalCountElement.textContent = formatNumber(totalCount);
        totalCountTextElement.textContent = chooseWordForm(totalCount, ['товар', 'товара', 'товаров'])
        priceOriginalElement.textContent = formatNumber(totalOriginalPrice);
        priceDiscountElement.textContent = formatNumber(discount);

    } else {
        totalPriceElement.textContent = 0;
        totalCountElement.textContent = 0;
        priceOriginalElement.textContent = 0;
        priceDiscountElement.textContent = 0;
    }
}

export function getFinalPrice() {
    return cartState.products.filter(product => product.isSelected).reduce((acc, {price: {discounted}, count}) => {
        return acc += discounted * count;
    }, 0);
}

export function getTotalCount() {
    return cartState.products.filter(product => product.isSelected).reduce((acc, {count}) => {
        return acc += +count;
    }, 0)
}

function changeProductCount(productID, newCount) {
    const product = cartState.products.find(product => product.id == productID);
    product.count = newCount;

    updatePrice(product);
    updateShippingDate();
    updateTotalPrice()
}

function updatePrice(product) {
    const productElement = document.querySelector(`.item[data-id='${product.id}']`);

    const discountedPriceElement = productElement.querySelector('.item__meta .item__sum-total-value');
    const originalPriceElement = productElement.querySelector('.item__meta .item__sum-discountless-value');
    const discountedPriceElementMobile = productElement.querySelector('.item__details .item__sum-total-value');
    const originalPriceElementMobile = productElement.querySelector('.item__details .item__sum-discountless-value');

    const newDiscountedPrice = formatNumber(product.count * product.price.discounted);
    const newOriginalPrice = formatNumber(product.count * product.price.original);

    discountedPriceElement.textContent = newDiscountedPrice;
    originalPriceElement.textContent = newOriginalPrice;
    discountedPriceElementMobile.textContent = newDiscountedPrice;
    originalPriceElementMobile.textContent = newOriginalPrice;
}

function selectProduct(id) {
    if (!cartState.selectedIds.find(selectedId => selectedId == id)) {
        cartState.selectedIds.push(id);
    }
}

function deselectProduct(id) {
    cartState.selectedIds = cartState.selectedIds.filter(selectedId => selectedId != id);
}

function handleSelectAllInput(input) {
    const isAllSelected = cartState.selectedIds.length === cartState.products.length;

    if (isAllSelected) {
        input.checked = true;
    } else {
        input.checked = false;
    }
}