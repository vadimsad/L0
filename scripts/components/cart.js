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
            stock: 2,
            count: 1,
            isSelected: false,
            isFavorite: false,
        },
        {
            id: 2,
            title: 'Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe',
            price: {
                discounted: 10500,
                original: 11500
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
            stock: 1000,
            count: 10,
            isSelected: false,
            isFavorite: false,
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
            stock: 2,
            count: 2,
            isSelected: false,
            isFavorite: false,
        },
    ],
    selectedIds: []
};

const selectAllButton = document.querySelector('.cart #select-all');

export function toggleProduct(product, selectMode) {
    const productID = product.dataset.id;
    const productState = cartState.products.find(product => product.id == productID);

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

    handleSelectAllInput(selectAllButton)
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

    if (event.target.value == '' || event.target.value == 0) {
        event.target.value = 1;
    } else {
        event.target.value = parseInt(event.target.value);
    }

    changeProductCount(productID, event.target.value);
}

function changeCount(event, increment) {
    const input = event.target.closest('.item__counter').querySelector('.item__counter-input');
    const currentValue = parseInt(input.value);
    const minValue = parseInt(input.getAttribute('min')) || 1;
    const maxValueLength = parseInt(input.getAttribute('maxlength')) || 3;
    
    const newValue = increment ? currentValue + 1 : currentValue - 1;
    if (newValue >= minValue && newValue.toString().length <= maxValueLength) {
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


function changeProductCount(productID, newCount) {
    const product = cartState.products.find(product => product.id == productID);
    product.count = newCount;

    updatePrice(product);
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

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}