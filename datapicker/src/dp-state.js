export default class DPState {
  constructor(minDate, maxDate, selectedDate, monthCounter, isOpened) {
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.selectedDate = selectedDate;
    this.monthCounter = monthCounter;
    this.isOpened = isOpened;
  }
}