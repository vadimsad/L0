import handleOrderSubmit from './components/order.js'
import { handleTelInputChange, validateInput } from './utils/validation.js';

const orderForm = document.querySelector('#make-order-form');
const recepientForm = document.querySelector('#recepient-data');

orderForm.addEventListener('submit', (event) => handleOrderSubmit(event, recepientForm));

recepientForm.querySelectorAll('input').forEach(input => {
    input.addEventListener('blur', () => {
        if (!input.value) {
            return;
        }

        if (!input.oninput) {
            input.oninput = () => validateInput(input);
        }

        validateInput(input);
    })

    if (input.id === 'tel') {
        input.addEventListener('input', () => handleTelInputChange(input))
    }
})