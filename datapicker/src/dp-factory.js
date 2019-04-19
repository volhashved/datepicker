import Datepicker from './dp.js';
import Render from './dp-render.js';
import Formator from './dp-formator';

export default class DPFactory {
  constructor() {}

  getDatepicker(minDate, maxDate) {
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.formator = new Formator();
    this.render = new Render();
    this.dp = new Datepicker(minDate, maxDate, this.render, this.formator);

    return this.dp;
  }
}