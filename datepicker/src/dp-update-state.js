import { DateFormatError } from './dp-errors.js';

export default class DPUpdateState {
  constructor(isOpened, calendarDate, selectedDate, minDate, maxDate) {
    this.isOpened = isOpened;

    if(calendarDate && !(calendarDate instanceof Date)) {
      throw new DateFormatError(`Calendar date is type of ${calendarDate.constructor.name} but expected type is Date`);
    }
    this.calendarDate = calendarDate;

    if(selectedDate && !(selectedDate instanceof Date)) {
      throw new DateFormatError(`Selected date is type of ${selectedDate.constructor.name} but expected type is Date`);
    }
    else if(!selectedDate) {
      this.selectedDate = null;
    }
    this.selectedDate = selectedDate;

    if(minDate && !(minDate instanceof Date)) {
      throw new DateFormatError(`Min date is type of ${minDate.constructor.name} but expected type is Date`);
    }
    this.minDate = minDate;

    if(maxDate && !(maxDate instanceof Date)) {
      throw new DateFormatError(`Max date is type of ${maxDate.constructor.name} but expected type is Date`);
    }
    this.maxDate = maxDate;
  }
}