import { validateForm } from "../utils/validation.js";

export default function handleOrderSubmit(event, formToValidate) {
    if (!formToValidate) {
        return;
    };

    validateForm(event, formToValidate);
}