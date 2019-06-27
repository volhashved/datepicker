import { DateFormatError } from './dp-errors.js';

export default class DPUpdateState {
  constructor(isOpened, calendarDate, selectedDate, minDate, maxDate) {
    this.isOpened = isOpened;

    if(calendarDate instanceof Date) {
      this.calendarDate = calendarDate;
    }
    else {
      throw new DateFormatError(`Calendar date is type of ${calendarDate.constructor.name} but expected type is Date`);
    }

    if(selectedDate instanceof Date) {
      this.selectedDate = selectedDate;
    }

    if(minDate && (minDate instanceof Date)) {
      this.minDate = minDate;
    }

    if(maxDate && (maxDate instanceof Date)) {
      this.maxDate = maxDate;
    }
  }
}