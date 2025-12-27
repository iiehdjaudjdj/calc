let calcCurrentValue = '0';
let calcPreviousValue = '';
let calcOperator = '';
let calcShouldReset = false;
let calcFullExpression = '';

const calcDisplay = document.getElementById('calcDisplay');
const calcExpression = document.getElementById('calcExpression');
const calcButtons = document.querySelectorAll('.calc-btn');

// show the number sa screen
function calcUpdateDisplay() {
    calcDisplay.textContent = calcCurrentValue;
    
    if (calcFullExpression !== '') {
        calcExpression.textContent = calcFullExpression;
    } else if (calcPreviousValue && calcOperator && calcShouldReset) {
        calcExpression.textContent = calcPreviousValue + ' ' + calcOperator;
    } else {
        calcExpression.textContent = '';
    }
}

// accept the number that the user input
function calcHandleNumber(number) {
    if (calcShouldReset) {
        calcCurrentValue = '0';
        calcShouldReset = false;
        calcFullExpression = '';
    }
    
    if (calcCurrentValue === '0') {
        calcCurrentValue = number;
    } else {
        calcCurrentValue += number;
    }
    
    if (calcPreviousValue && calcOperator) {
        calcFullExpression = calcPreviousValue + ' ' + calcOperator + ' ' + calcCurrentValue;
    }
    
    calcUpdateDisplay();
}

function calcHandleDecimal() {
    if (calcShouldReset) {
        calcCurrentValue = '0';
        calcShouldReset = false;
        calcFullExpression = '';
    }
    
    if (!calcCurrentValue.includes('.')) {
        calcCurrentValue += '.';
        
        if (calcPreviousValue && calcOperator) {
            calcFullExpression = calcPreviousValue + ' ' + calcOperator + ' ' + calcCurrentValue;
        }
        
        calcUpdateDisplay();
    }
}

// operator handling
function calcHandleOperator(operator) {
    const inputValue = parseFloat(calcCurrentValue);
    
    if (calcPreviousValue === '') {
        calcPreviousValue = inputValue;
        calcFullExpression = '';
    } else if (calcOperator) {
        const result = calcPerformCalculation();
        calcCurrentValue = String(result);
        calcPreviousValue = result;
        calcFullExpression = '';
        calcUpdateDisplay();
    }
    
    calcShouldReset = true;
    calcOperator = operator;
    calcFullExpression = calcPreviousValue + ' ' + calcOperator;
    calcUpdateDisplay();
}

// actual computation of the numbers
function calcPerformCalculation() {
    const prev = parseFloat(calcPreviousValue);
    const current = parseFloat(calcCurrentValue);
    
    if (isNaN(prev) || isNaN(current)) {
        return current;
    }
    
    switch (calcOperator) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '*':
            return prev * current;
        case '/':
            return current !== 0 ? prev / current : 0;
        case '%':
            return prev % current;
        default:
            return current;
    }
}

// get the final answer
function calcHandleEquals() {
    if (calcPreviousValue === '' || calcOperator === '') {
        return;
    }
    
    const result = calcPerformCalculation();
    calcFullExpression = calcPreviousValue + ' ' + calcOperator + ' ' + calcCurrentValue + ' =';
    calcCurrentValue = String(result);
    calcPreviousValue = '';
    calcOperator = '';
    calcShouldReset = true;
    calcUpdateDisplay();
}

function calcHandleClear() {
    calcCurrentValue = '0';
    calcPreviousValue = '';
    calcOperator = '';
    calcShouldReset = false;
    calcFullExpression = '';
    calcUpdateDisplay();
}

function calcHandleBackspace() {
    if (calcCurrentValue.length > 1) {
        calcCurrentValue = calcCurrentValue.slice(0, -1);
    } else {
        calcCurrentValue = '0';
    }
    calcUpdateDisplay();
}

function calcAddLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
}

function calcRemoveLoadingState(button) {
    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
    }, 300);
}

function calcHandleButtonClick(event) {
    const button = event.currentTarget;
    const value = button.getAttribute('data-value');
    const action = button.getAttribute('data-action');
    
    calcAddLoadingState(button);
    
    if (action === 'clear') {
        calcHandleClear();
    } else if (action === 'backspace') {
        calcHandleBackspace();
    } else if (action === 'operator') {
        calcHandleOperator(value);
    } else if (action === 'equals') {
        calcHandleEquals();
    } else if (value === '.') {
        calcHandleDecimal();
    } else if (value !== null) {
        calcHandleNumber(value);
    }
    
    calcRemoveLoadingState(button);
}

calcButtons.forEach(button => {
    button.addEventListener('click', calcHandleButtonClick);
});

calcUpdateDisplay();

