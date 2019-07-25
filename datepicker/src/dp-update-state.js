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

    if(selectedDate && selectedDate instanceof Date) {
      this.selectedDate = selectedDate;
    }
    else if(!selectedDate) {
      this.selectedDate = null;
    }
    else{
      throw new DateFormatError(`Selected date is type of ${selectedDate.constructor.name} but expected type is Date`);
    }

    if(minDate && (minDate instanceof Date)) {
      this.minDate = minDate;
    }
    else {
      throw new DateFormatError(`Min date is type of ${minDate.constructor.name} but expected type is Date`);
    }

    if(maxDate && (maxDate instanceof Date)) {
      this.maxDate = maxDate;
    }
    else {
      throw new DateFormatError(`Max date is type of ${maxDate.constructor.name} but expected type is Date`);
    }
  }
}