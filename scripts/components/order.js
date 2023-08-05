import { validateForm, validateInput } from "../utils/validation.js";

export default function handleOrderSubmit(event, formToValidate) {
    if (!formToValidate) {
        return;
    };

    const {isValid, invalidInputs} = validateForm(formToValidate);

    if(!isValid) {
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
    inputs.forEach(input =>input.oninput = () => validateInput(input));

}