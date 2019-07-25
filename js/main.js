'use strict';
const DPFactory = myApp.default;

class Render {
    constructor() {}

    create(input, dp) {
        const dpView = input;
        dp.render(input);
        return dpView
    }

    renderErrorField(input, errorMessage) {
        const errorField = document.createElement('div');
        errorField.className = "input__error input__error_hidden";
        errorField.innerHTML = errorMessage || '';
        input.parentNode.insertBefore(errorField, input.nextSibling);
        return errorField;
    }

    showErrorMessage(input, errorField) {
        input.classList.add('input_invalid');
        errorField.classList.remove('input__error_hidden');
    }

    hideErrorMessage(input, errorField) {
        input.classList.remove('input_invalid');
        errorField.classList.add('input__error_hidden');
        input.parentNode.removeChild(errorField);
    }
}

class DPApp {
    constructor() {}

    execute() {
        const render = new Render();

        const dp1 = DPFactory.getDatepicker(new Date(), new Date(2020, 3, 20));
        const dp1View = render.create(document.querySelectorAll("input")[0], dp1);

        const dp2 = DPFactory.getDatepicker(new Date(), new Date(2020, 3, 20));
        const dp2View = render.create(document.querySelectorAll("input")[1], dp2);

        // RxJS
        let startSelectedDate;
        let endAvailableDate;
        let endSelectedDate;
        let dp1ErrorFieldRef = null;
        let dp2ErrorFieldRef = null;

        const stream1$ = dp1.onSelectedDateChange$;
        stream1$.subscribe((startDate) => {
            if(dp1ErrorFieldRef) {
                render.hideErrorMessage(dp1View, dp1ErrorFieldRef);
            }
            dp1ErrorFieldRef = render.renderErrorField(dp1View);
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

            if(dp2.maxDate < startSelectedDate) {
                dp2.maxDate = startSelectedDate;
            }
            dp2.minDate = startSelectedDate;
            dp2.maxDate = endAvailableDate;

            if(endSelectedDate) {
                dp2.inputValue = endSelectedDate;
            }
        });

        const stream2$ = dp2.onSelectedDateChange$;
        stream2$.subscribe((endDate) => {
            if(dp2ErrorFieldRef) {
                render.hideErrorMessage(dp2View, dp2ErrorFieldRef);
            }
            dp2ErrorFieldRef = render.renderErrorField(dp2View);
            endSelectedDate = endDate;
        });


        // Errors
        const err1$ = dp1.onErrorOccured$;
        err1$.subscribe((err) => {
            if(dp1ErrorFieldRef) {
                render.hideErrorMessage(dp1View, dp1ErrorFieldRef);
            }
            dp1ErrorFieldRef = render.renderErrorField(dp1View, err);
            render.showErrorMessage(dp1View, dp1ErrorFieldRef);
        });

        const err2$ = dp2.onErrorOccured$;
        err2$.subscribe((err) => {
            if(dp2ErrorFieldRef) {
                render.hideErrorMessage(dp2View, dp2ErrorFieldRef);
            }
            dp2ErrorFieldRef = render.renderErrorField(dp2View, err);
            render.showErrorMessage(dp2View, dp2ErrorFieldRef);
        });

    }
}

const dpApp = new DPApp();
dpApp.execute();