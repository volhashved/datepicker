import Datepicker from './dp.js';
import Render from './dp-render.js';
import Formatter from './dp-formator';

export default class DPFactory {
  constructor() {}

  static getDatepicker(minDate, maxDate) {
    const formatter = new Formatter();
    const render = new Render();
    const dp = new Datepicker(minDate, maxDate, render, formatter);

    return dp;
  }
}