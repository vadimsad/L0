import { chooseWordForm } from "../utils/chooseWordForm.js";
import { formatNumber } from "../utils/formatNumber.js";
import { cartState } from "../model.js";

// Константы по умолчанию
const DEFAULT_WORKTIME = 'Ежедневно с 10 до 21';
const DEFAULT_RATING = 5.00;
const DEFAULT_CARD_EXPIRY = '01/42';

// Получение кнопки "Выбрать все"
const selectAllButton = document.querySelector('.cart #select-all');

// Функция переключения товара (выбор/отмена выбора)
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

// Обработчик ввода количества товара
export function handleCountInput(event) {
    const input = event.target;
    const maxValueLength = parseInt(input.getAttribute('maxlength')) || 3;
    const inputValue = input.value;

    const sanitizedValue = inputValue.replace(/\D/g, '');
    const trimmedValue = sanitizedValue.slice(0, maxValueLength);

    input.value = trimmedValue;
}


// Обработчик изменения количества товара
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

// Функция добавления в избранное
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

// Функция удаления товара
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

// Функция изменения способа оплаты
export function changePayment(event) {
    event.preventDefault();

    const dialog = event.target.closest('dialog');
    const newID = event.target.querySelector('input:checked').id;
    const newCardNumber = event.target.querySelector('input:checked ~ .payment-info .payment-info__number').textContent;
    const newCardExpiry = event.target.querySelector('input:checked').dataset.expiry || DEFAULT_CARD_EXPIRY;
    const newImage = event.target.querySelector('input:checked ~ .payment-info .payment-info__logo img').getAttribute('src');

    cartState.payment.id = newID;
    cartState.payment.cardNumber = newCardNumber;
    cartState.payment.cardExpiry = newCardExpiry;
    cartState.payment.imageSource = newImage;
    updatePaymentInfo();
    dialog.close();
}

// Обновление информации о способе оплаты
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

// Функция изменения адреса доставки
export function changeShippingAddressCallback(event) {
    event.preventDefault();

    const dialog = event.target.closest('dialog');
    const newID = event.target.querySelector('input:checked').id;
    const newType = event.target.querySelector('input:checked').dataset.type;
    const newAddress = event.target.querySelector('input:checked ~ p.text-16').textContent;
    const newRating = event.target.querySelector('input:checked ~ .delivery-dialog__address-description .rating')?.textContent || DEFAULT_RATING;
    const newWorkTime = DEFAULT_WORKTIME;

    cartState.shipping = { id: newID, type: newType, address: newAddress, rating: newRating, workTime: newWorkTime };
    updateShippingInfo();
    dialog.close();
}

// Функция изменения адреса доставки (вариант без события)
export function changeShippingAddress(checkedInput) {
    const newID = checkedInput.id;
    const newType = checkedInput.dataset.type;
    const newAddress = checkedInput.closest('label').querySelector('p.text-16').textContent;
    const newRating = checkedInput.closest('label').querySelector('.delivery-dialog__address-description .rating')?.textContent || DEFAULT_RATING;
    const newWorkTime = DEFAULT_WORKTIME;

    cartState.shipping = { id: newID, type: newType, address: newAddress, rating: newRating, workTime: newWorkTime };
    updateShippingInfo();
}

// Обновление информации о способе доставки
function updateShippingInfo() {
    const addressElement = document.querySelector('.main__shipping-address');
    const shippingInfo = document.querySelector('.shipping-info__block-address');
    const shippingInfoType = shippingInfo.querySelector('dt');
    const shippingInfoAddress = shippingInfo.querySelector('dd p');
    const shippingInfoRating = shippingInfo.querySelector('.shipping-info__rating');
    const shippingInfoWorkTime = shippingInfo.querySelector('.shipping-info__worktime');
    const shippingInfoTypeInSummary = document.querySelector('.main__shipping-delivery .main__shipping-title .heading-4');

    addressElement.textContent = cartState.shipping.address;

    switch (cartState.shipping.type) {
        case 'pickup': {
            shippingInfoType.textContent = 'Пункт выдачи';
            shippingInfoTypeInSummary.textContent = 'Доставка в пункт выдачи';
            break;
        }
        case 'courier': {
            shippingInfoType.textContent = 'Доставит курьер';
            shippingInfoTypeInSummary.textContent = 'Доставит курьер';
            break;
        }
    }

    shippingInfoRating.textContent = cartState.shipping.rating;
    shippingInfoAddress.textContent = cartState.shipping.address;
    shippingInfoWorkTime.textContent = cartState.shipping.workTime;
}

// Обобщенная функция для изменения количества товара
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

// Функция для увеличения количества товара
export function increaseCount(event) {
    changeCount(event, true);
}

// Функция для уменьшения количества товара
export function decreaseCount(event) {
    changeCount(event, false);
}

// Обновление даты доставки
function updateShippingDate() {
    const productsToShip = cartState.products.map(({ isSelected, id, count, shippingSchedule }) => {
        if (isSelected) {
            return { id, count, shippingSchedule }
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

// Обновление даты доставки в главной форме заказа
function updateShipmentDateInForm(dates) {
    const datesString = Array.from(dates);

    if (datesString.length === 0) {
        document.querySelector('.main__shipping-date').textContent = '';
        return;
    }

    const minDate = Math.min(...datesString[0][0].match(/\d+/g));
    const maxDate = Math.max(...datesString[datesString.length - 1][0].match(/\d+/g));
    const month = datesString[0][0].match(/[a-zA-Zа-яА-Я]/g).slice(0, 3).join('');

    document.querySelector('.main__shipping-date').textContent = `${minDate}−${maxDate} ${month}`;
}

// Расчет дат доставки для товара
function calculateShippingDates({ id, count, shippingSchedule }, dates) {
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

// Обновление иконок с количеством товара в корзине
function updateCartLabels() {
    const cartLabel = document.querySelector('.header__link_cart-label.item-label');
    const cartLabelMobile = document.querySelector('.footer__menu-link-label.item-label');
    const productsRemains = cartState.products.length;

    cartLabel.textContent = productsRemains;
    cartLabelMobile.textContent = productsRemains;

    if (productsRemains === 0) {
        cartLabel.style.display = 'none';
        cartLabelMobile.style.display = 'none';
    } else {
        cartLabel.style.display = '';
        cartLabelMobile.style.display = '';
    }
}

// Обновление общей стоимости
function updateTotalPrice() {
    const totalPriceElement = document.querySelector('.main__total-prices-value #price-total');
    const totalCountElement = document.querySelector('.main__total-price #goods-count');
    const totalCountTextElement = document.querySelector('.main__total-price #goods-text');
    const priceOriginalElement = document.querySelector('.main__total-prices-value #price-discountless');
    const priceDiscountElement = document.querySelector('.main__total-prices-value #price-discount');
    const immediatePaymentCheckbox = document.querySelector('#make-order-form #immediate-payment');

    const selectedProducts = cartState.products.filter(product => product.isSelected);

    if (selectedProducts.length >= 0) {
        const totalDiscountedPrice = selectedProducts.reduce((acc, { price: { discounted }, count, discounts }) => {
            return acc += discounted * count;
        }, 0);
        const totalOriginalPrice = selectedProducts.reduce((acc, { price: { original }, count }) => {
            return acc += original * count;
        }, 0);
        const totalCount = selectedProducts.reduce((acc, { count }) => {
            return acc += +count;
        }, 0)
        const discount = totalDiscountedPrice - totalOriginalPrice;

        totalPriceElement.textContent = formatNumber(totalDiscountedPrice);
        totalCountElement.textContent = formatNumber(totalCount);
        totalCountTextElement.textContent = chooseWordForm(totalCount, ['товар', 'товара', 'товаров'])
        priceOriginalElement.textContent = formatNumber(totalOriginalPrice);
        priceDiscountElement.textContent = formatNumber(discount.toString().replace('-', '−'));

        if (immediatePaymentCheckbox.checked) {
            document.querySelector('.main__total-submit').textContent = `Оплатить ${formatNumber(totalDiscountedPrice)} сом`;
        }

    } else {
        totalPriceElement.textContent = 0;
        totalCountElement.textContent = 0;
        priceOriginalElement.textContent = 0;
        priceDiscountElement.textContent = 0;

        document.querySelector('.main__total-submit').textContent = `Оплатить ${0} сом`;
    }
}

// Получение общей цены для оплаты
export function getFinalPrice() {
    return cartState.products.filter(product => product.isSelected).reduce((acc, { price: { discounted }, count }) => {
        return acc += discounted * count;
    }, 0);
}

// Получение общего количества выбранных товаров
export function getTotalCount() {
    return cartState.products.filter(product => product.isSelected).reduce((acc, { count }) => {
        return acc += +count;
    }, 0)
}

// Изменение количества товара
function changeProductCount(productID, newCount) {
    const product = cartState.products.find(product => product.id == productID);
    product.count = newCount;

    updatePrice(product);
    updateShippingDate();
    updateTotalPrice()
}

// Обновление цен на товар на странице
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

// Выбор товара
function selectProduct(id) {
    if (!cartState.selectedIds.find(selectedId => selectedId == id)) {
        cartState.selectedIds.push(id);
    }
}

// Отмена выбора товара
function deselectProduct(id) {
    cartState.selectedIds = cartState.selectedIds.filter(selectedId => selectedId != id);
}

// Обработка состояния инпута выбора всех товаров
function handleSelectAllInput(input) {
    const isAllSelected = cartState.selectedIds.length === cartState.products.length;

    if (isAllSelected) {
        input.checked = true;
    } else {
        input.checked = false;
    }
}