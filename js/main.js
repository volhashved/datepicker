'use strict';
const DPFactory = myApp.default;
const dp1 = DPFactory.getDatepicker(new Date(), new Date(2020, 3, 20));
const dp2 = DPFactory.getDatepicker(new Date(), new Date(2020, 3, 20));

class Render {
    constructor(input, dp) {
        this.input = input;
        this.dp = dp;
        this.init();
    }

    init() {
        this.dp.render(this.input);
    }

    renderErrorField = (err) => {
        this.errorField = document.createElement('div');
        this.errorField.className = "input__error input__error_hidden";
        this.errorField.innerHTML = err;
        this.input.parentNode.insertBefore(this.errorField, this.input.nextSibling);
        return this.errorField;
    }

    showErrorMessage = () => {
        this.input.classList.add('input_invalid');
        this.errorField.classList.remove('input__error_hidden');
    }

    hideErrorMessage = () => {
        this.input.classList.remove('input_invalid');
        this.errorField.classList.add('input__error_hidden');
        this.input.parentNode.removeChild(this.errorField);
    }
}

class DPApp {
    constructor() {
        this.dpApp1 = new Render(document.querySelectorAll("input")[0], dp1);
        this.dpApp2 = new Render(document.querySelectorAll("input")[1], dp2);
    }

    execute() {
        // RxJS
        let startSelectedDate;
        let endAvailableDate;
        let endSelectedDate;
        let dp1ErrorFieldRef = null;
        let dp2ErrorFieldRef = null;

        const stream1$ = dp1.onSelectedDateChange$;
        stream1$.subscribe((startDate) => {
            if(dp1ErrorFieldRef) {
                this.dpApp1.hideErrorMessage();
            }
            dp1ErrorFieldRef = this.dpApp1.renderErrorField();
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
                this.dpApp2.hideErrorMessage();
            }
            dp2ErrorFieldRef = this.dpApp2.renderErrorField();
            endSelectedDate = endDate;
        });


        // Errors
        const err1$ = dp1.onErrorOccured$;
        err1$.subscribe((err) => {
            if(dp1ErrorFieldRef) {
                this.dpApp1.hideErrorMessage();
            }
            dp1ErrorFieldRef = this.dpApp1.renderErrorField(err);
            this.dpApp1.showErrorMessage();
        });

        const err2$ = dp2.onErrorOccured$;
        err2$.subscribe((err) => {
            if(dp2ErrorFieldRef) {
                this.dpApp2.hideErrorMessage();
            }
            dp2ErrorFieldRef = this.dpApp2.renderErrorField(err);
            this.dpApp2.showErrorMessage();
        });

    }
}

const dpApp = new DPApp();
dpApp.execute();