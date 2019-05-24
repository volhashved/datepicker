'use strict';

const DPFactory = myApp.default;

let dp1 = DPFactory.getDatepicker(new Date(new Date().setHours(0,0,0,0)), new Date(2020, 3, 20));

// console.log(dp1.selectedDate);
// dp1.minDate = (new Date(2019, 1, 10));
// dp1.maxDate = (new Date(2019, 3, 22));
// dp1.selectedDate = (new Date(2019, 1, 20));
dp1.render(document.querySelectorAll("input")[0]);
// dp1.destroy();

let dp2 = DPFactory.getDatepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
dp2.render(document.querySelectorAll("input")[1]);


// RxJS
let startAvailableDate;
let endAvailableDate;
let endSelectedDate;

const stream1$ = dp1.onSelectedDateChange$;
stream1$.subscribe((startDate) => {
    startAvailableDate = startDate;
    endAvailableDate = new Date( startAvailableDate.getFullYear(), startAvailableDate.getMonth(), startAvailableDate.getDate() + 20 );

    dp2 = DPFactory.getDatepicker(startAvailableDate, endAvailableDate);

    if(endSelectedDate) {
        if(startAvailableDate > endSelectedDate || endAvailableDate < endSelectedDate) {
            endSelectedDate = startDate;
        }
        dp2.selectedDate = endSelectedDate;
    }
    dp2.render(document.querySelectorAll("input")[1]);

    if(endSelectedDate) {
        dp2.inputValue = endSelectedDate;
    }

    const stream2$ = dp2.onSelectedDateChange$;
    stream2$.subscribe((endDate) => {
        endSelectedDate = endDate;
    });
});