import { validateForm, validateInput } from "../utils/validation.js";

export default function handleOrderSubmit(event, formToValidate) {
    if (!formToValidate) {
        return;
    };

    if(!validateForm(formToValidate)) {
        event.preventDefault();
    }

    // Если нужно, чтобы после отправки формы пустые поля валидировались в момент ввода, а не после события blur:
    const inputs = formToValidate.querySelectorAll('input');
    inputs.forEach(input =>input.oninput = () => validateInput(input));

}