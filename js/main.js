'use strict';

new Datepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
new Datepicker(new Date(2017, 0, 25), new Date(2018, 2, 11));
new Datepicker();

const dp = new Datepicker();
dp.minDate = (new Date(2019, 1, 5));
dp.maxDate = (new Date(2019, 3, 20));
dp.selectedDate = (new Date(2019, 1, 20));