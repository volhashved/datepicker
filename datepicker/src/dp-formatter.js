import { InputValueError } from './dp-errors.js';

export default class Formatter {
  constructor() {
    this.weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  }

  format(date) {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  formatActiveMonth(date) {
    return `${date.toLocaleString( "en", {
      year: "numeric",
      month: "long"
    })}`;
  }

  parseDate(inputValue) {
    const re = /^([0-2]?[\d]|3[0-1])(\/)(0?[0-9]{1}|1[0-2])(\/)[0-9]{4}$/;
    if(!re.test(inputValue)) {
      throw new InputValueError(`Date format ${inputValue} is invalid, valid date format is dd/mm/yyyy`);
    }
    else {
      const dateArr = inputValue.split("/");
      let date = new Date(dateArr[2], dateArr[1]-1, dateArr[0]);
      return date;
    }
  }
}