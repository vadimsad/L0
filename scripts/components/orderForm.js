import { formatNumber } from "../utils/formatNumber.js";
import { validateForm, validateInput } from "../utils/validation.js";

export default function handleOrderSubmit(event, formToValidate) {
    if (!formToValidate) {
        return;
    };

    const { isValid, invalidInputs } = validateForm(formToValidate);

    if (!isValid) {
        event.preventDefault();

        invalidInputs.forEach(input => {
            if (!input.classList.contains('shake')) {
                input.classList.add('shake');
            }
            setTimeout(() => {
                input.classList.remove('shake')
            }, 350)
        })
    }

    // Если нужно, чтобы после отправки формы пустые поля валидировались в момент ввода, а не после события blur:
    const inputs = formToValidate.querySelectorAll('input');
    inputs.forEach(input => input.oninput = () => validateInput(input));
}

export function handleImmediatePaymentChange(checkbox, submitButton, priceBlock, elementToHide) {
    const label = elementToHide.closest('.main__payment-term').querySelector('label');

    if (checkbox.checked) {
        submitButton.textContent = `Оплатить ${formatNumber(priceBlock.textContent)} сом`;
        elementToHide.style.display = 'none';
        label.style.marginBottom = 0;
    } else {
        submitButton.textContent = 'Заказать';
        elementToHide.style.display = 'block';
        label.style.marginBottom = '';
    }
}