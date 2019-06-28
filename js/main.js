'use strict';

const DPFactory = myApp.default;

const dp1 = DPFactory.getDatepicker(new Date(), new Date(2020, 3, 20));
const input1 = document.querySelectorAll("input")[0];
let dpError1 = null;

// dp1.minDate = (new Date(2019, 1, 10));
// dp1.maxDate = (new Date(2019, 3, 22));
// dp1.selectedDate = (new Date(2019, 1, 20));
dp1.render(input1);
// dp1.destroy();

const dp2 = DPFactory.getDatepicker(new Date(), new Date(2020, 3, 20));
const input2 = document.querySelectorAll("input")[1];
let dpError2 = null;
dp2.render(input2);

const renderErrorField = (inputField) => {
    const errorField = document.createElement('div');
    errorField.className = "input__error input__error_hidden";
    inputField.parentNode.insertBefore(errorField, inputField.nextSibling);
    return errorField;
}

const showErrorMessage = (inputField, errorField) => {
    inputField.classList.add('input_invalid');
    errorField.classList.remove('input__error_hidden');
    errorField.innerHTML = `Date format ${inputField.value} is invalid, valid date format is dd/mm/yyyy`;
}

const hideErrorMessage = (inputField, errorField) => {
    inputField.classList.remove('input_invalid');
    errorField.classList.add('input__error_hidden');
    inputField.parentNode.removeChild(errorField);
}


// RxJS
let startSelectedDate;
let endAvailableDate;
let endSelectedDate;

const stream1$ = dp1.onSelectedDateChange$;
stream1$.subscribe((startDate) => {
    if(dpError1) {
        hideErrorMessage(input1, dpError1);
    }
    dpError1 = renderErrorField(input1);
    startSelectedDate = startDate;
    endAvailableDate = new Date( startSelectedDate.getFullYear(), startSelectedDate.getMonth(), startSelectedDate.getDate() + 20 );

    if(endSelectedDate) {
        if(startSelectedDate > endSelectedDate) {
            endSelectedDate = startSelectedDate;
            dp2.maxDate = startSelectedDate;
            dp2.minDate = startSelectedDate;
            dp2.selectedDate = endSelectedDate;
        }
        else if(endAvailableDate < endSelectedDate) {
            endSelectedDate = startSelectedDate;
            dp2.minDate = startSelectedDate;
            dp2.maxDate = startSelectedDate;
            dp2.selectedDate = endSelectedDate;
        }
    }

    dp2.minDate = startSelectedDate;
    dp2.maxDate = endAvailableDate;

    if(endSelectedDate) {
        dp2.inputValue = endSelectedDate;
    }
});

const stream2$ = dp2.onSelectedDateChange$;
stream2$.subscribe((endDate) => {
    if(dpError2) {
        hideErrorMessage(input2, dpError2);
    }
    dpError2 = renderErrorField(input2);
    endSelectedDate = endDate;
});


// Errors
const err1$ = dp1.onErrorOccured$;
err1$.subscribe((err) => {
    if(dpError1) {
        hideErrorMessage(input1, dpError1);
    }
    dpError1 = renderErrorField(input1);
    showErrorMessage(input1, dpError1);
});

const err2$ = dp2.onErrorOccured$;
err2$.subscribe((err) => {
    if(dpError2) {
        hideErrorMessage(input2, dpError2);
    }
    dpError2 = renderErrorField(input2);
    showErrorMessage(input2, dpError2);
});
