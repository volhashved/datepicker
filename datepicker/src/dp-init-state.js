import { DateFormatError, DateValueError, InputError} from './dp-errors.js';

export default class DPInitState {
  constructor(input, formatter, minDate, maxDate) {
    if(input && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      this.input = input;
    }
    else {
      throw new InputError('Enter a valid input');
    }

    this.formatter = formatter;

    if(minDate instanceof Date) {
      this.minDate = minDate;
    }
    else {
      throw new DateFormatError(`Min date is type of ${minDate.constructor.name} but expected type is Date`);
    }

    if(maxDate instanceof Date) {
      if(maxDate > minDate) {
        this.maxDate = maxDate;
      }
      else {
        throw new DateValueError(`Min date ${formatter.format(minDate)} can not be later than max date ${formatter.format(maxDate)}`);
      }
    }
    else {
      throw new DateFormatError(`Max date is type of ${maxDate.constructor.name} but expected type is Date`);
    }
  }
}