'use strict';

const DPFactory = myApp.default;

const dp1 = DPFactory.getDatepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
// dp1.minDate = (new Date(2019, 1, 10));
// dp1.maxDate = (new Date(2019, 3, 22));
// dp1.selectedDate = (new Date(2019, 1, 20));
dp1.render(document.querySelectorAll("input")[0]);
// dp1.destroy();

const dp2 = DPFactory.getDatepicker(new Date(2017, 0, 25), new Date(2018, 2, 11));
dp2.render(document.querySelectorAll("input")[1]);