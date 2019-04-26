export default class Formatter {
  constructor() {
    this.weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  }

  format(date) {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }
}