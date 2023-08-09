export const cartState = {
    products: [
        {
            id: 1,
            title: 'Футболка UZcotton мужская',
            price: {
                discounted: 368,
                original: 1051
            },
            discounts: [
                {
                    name: 'Скидка 55%',
                    value: 0.55
                },
                {
                    name: 'Скидка покупателя 10%',
                    value: 0.1
                },
            ],
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
                discounted: 4025,
                original: 11500,
            },
            discounts: [
                {
                    name: 'Скидка 55%',
                    value: 0.55
                },
                {
                    name: 'Скидка покупателя 10%',
                    value: 0.1
                },
            ],
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
                discounted: 167,
                original: 475
            },
            discounts: [
                {
                    name: 'Скидка 55%',
                    value: 0.55
                },
                {
                    name: 'Скидка покупателя 10%',
                    value: 0.1
                },
            ],
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
        id: 'pickup-1',
        type: 'pickup',
        address: 'Бишкек, улица Ахматбека Суюмбаева, 12/1',
        rating: 4.99,
        wortTime: 'Ежедневно с 10 до 21',
    },
    payment: {
        id: 'card-1',
        cardNumber: '1234 56•• •••• 1234',
        cardExpiry: '01/30',
        imageSource: './assets/icons/mir.svg',
    }
};