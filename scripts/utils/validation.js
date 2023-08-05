const INVALID_CLASSNAME = 'invalid';
const EMPTY_WARNINGS = {
    name: 'Укажите имя',
    surname: 'Введите фамилию',
    email: 'Укажите электронную почту',
    tel: 'Укажите номер телефона',
    itn: 'Укажите индекс',
};
const MISMATCH_WARNINGS = {
    email: 'Проверьте адрес электронной почты',
    tel: 'Формат: +9 999 999 99 99',
    itn: 'Формат: 1234567',
};

export function isInputEmpty(input) {
    const isEmpty = input.validity.valueMissing;

    if (isEmpty) {
        const inputID = input.id;
        const label = input.closest('label');
        const warningBlock = label.querySelector('.input-block__warning');
        markAsInvalid(label);
        showWarning(warningBlock, EMPTY_WARNINGS[inputID]);
    }
}

export function validateForm(event, form) {
    if (form.checkValidity()) {
        return true;
    }

    event.preventDefault();

    const inputs = form.querySelectorAll('input');
    inputs.forEach(isInputEmpty);
}

export function handleTelInputChange(input) {
    const inputValue = input.value.replace(/\D/g, '');
      let formattedValue = formatTelNumber(inputValue);
    input.value = formattedValue;
}

export function validateInput(input) {
    const inputID = input.id;
    const label = input.closest('label');
    const warningBlock = label.querySelector('.input-block__warning');
    const validity = input.validity;
    const inputMaxLength = input.getAttribute('data-maxlength');

    const phonePattern = /^\+\d\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
    const isTelValid = inputID === 'tel' ? (phonePattern.test(input.value) || input.value.length === 0) : true;

    if (!isTelValid || validity.typeMismatch || (inputMaxLength && input.value.length > inputMaxLength)) {
        markAsInvalid(label);
        showWarning(warningBlock, MISMATCH_WARNINGS[inputID]);
    } else {
        markAsValid(label);
        hideWarning(warningBlock);
    }
}


function formatTelNumber(number) {
    let formattedValue = '';
    let currentPos = 1;

    for (let i = 0; i < number.length; i++) {
        if (currentPos === 1) {
          formattedValue += '+';
        } else if (currentPos === 2 || currentPos === 5 || currentPos === 8 || currentPos === 10) {
          formattedValue += ' ';
        }
        formattedValue += number[i];
        currentPos++;
    }

    return formattedValue;
}

function markAsInvalid(element) {
    if (!element.classList.contains(INVALID_CLASSNAME)) {
        element.classList.add(INVALID_CLASSNAME)
    }
}

function markAsValid(element) {
    element.classList.remove(INVALID_CLASSNAME);
}

function showWarning(element, warning) {
    element.textContent = warning;
}

function hideWarning(element) {
    element.textContent = '';
}