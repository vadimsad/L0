import handleOrderSubmit from './components/orderForm.js'
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