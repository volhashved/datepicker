import { DateFormatError, DateValueError, InputError } from './dp-errors.js';
import DPState from './dp-state.js';

export default class Datepicker {
  get minDate() {
    return this._minDate;
  }

  set minDate(minVal) {
    if (minVal instanceof Date) {
      if(minVal > this._maxDate) {
        throw new DateValueError(`Min date  ${this._formator.setDateFormat(minVal)} can not be later than max date ${this._formator.setDateFormat(this._maxDate)}`);
      }
      this._minDate = minVal;
    }
    else {
      throw new DateFormatError('Enter a valid date format');
    }
  }

  get maxDate() {
    return this._maxDate;
  }

  set maxDate(maxVal) {
    if (maxVal instanceof Date) {
      if(maxVal < this._minDate) {
        throw new DateValueError(`Min date ${this._formator.setDateFormat(this._minDate)} can not be later than max date ${this._formator.setDateFormat(maxVal)}`);
      }
      this._maxDate = maxVal;
    }
    else {
      throw new DateFormatError('Enter a valid date format');
    }
  }

  get selectedDate() {
    return this._selectedDate;
  }

  set selectedDate(newDate) {
    if (newDate instanceof Date) {
      if(newDate < this._minDate || newDate > this._maxDate) {
        throw new DateValueError(`Selected date ${this._formator.setDateFormat(newDate)} should be between min ${this._formator.setDateFormat(this._minDate)} and max ${this._formator.setDateFormat(this._maxDate)} dates`);
      }
      this._selectedDate = newDate;
    }
    else {
      throw new DateFormatError('Enter a valid date format');
    }
  }

  constructor (minDate, maxDate, render, formator) {
    this._formator = formator;
    this._minDate = new Date(new Date().getFullYear(), 0, 1);
    this._maxDate = new Date(new Date().getFullYear(), 12, 0);
    this.minDate = minDate || this._minDate;
    this.maxDate = maxDate || this._maxDate;
    this._render = render;
    this._init();
  }

  open() {
    if(this._render.isRendered) {
      this._isOpened = true;
      if(!this._selectedDate) {
        this._setMonth();
        this._render.update(this._isOpened, this._year, this._month);
      }
      else {
        this._monthCounter = this._selectedDate.getMonth();
        this._render.update(this._isOpened, this._selectedDate.getFullYear(), this._selectedDate.getMonth());
        this._inputField.value = `${this._selectedDate.getDate()}/${this._selectedDate.getMonth()+1}/${this._selectedDate.getFullYear()}`;
      }
      // this.calendar.dayBtns.map(item => {
      //   item.addEventListener("click", (e) => this._selectDate(e));
      // });
    }
  }

  close() {
    this._isOpened = false;
    this._render.update(this._isOpened);
  }

  destroy() {
    if(this._inputField) {
      this._inputField.removeEventListener('click', this._openRef);
      this._inputField.removeEventListener('focus', this._onInputFocusRef);
      this._inputField.removeEventListener('blur', this._onInputBlurRef);
      this.calendar.todayBtn.removeEventListener('click', this._selectTodayRef);
      this.calendar.nextMonthBtn.removeEventListener('click', this._nextMonthRef);
      this.calendar.prevMonthBtn.removeEventListener('click', this._prevMonthRef);
      window.removeEventListener('click', this._windowClickRef);
      window.removeEventListener('keyup', this._handleKeypressRef);
      this._render._datePicker.parentNode.removeChild(this._datePicker);
    }
  }

  render(input) {
    if(!input) throw new InputError('There is no valid input');
    if(input.nodeName && input.nodeName.toLowerCase() === 'input') {
      this._inputField = input;
      this._render.isRendered = true;
      this._setMonth();
      const initState = new DPState(this.minDate, this.maxDate, this._selectedDate, this._monthCounter, this._isOpened);
      this.calendar = this._render.create(input, this._formator, initState);
      this._inputField.setAttribute('id', `${this._id}`);
      this._inputField.addEventListener('click', this._openRef);
      this._inputField.addEventListener('focus', this._onInputFocusRef);
      this._inputField.addEventListener('blur', this._onInputBlurRef);
      this.calendar.todayBtn.addEventListener('click', this._selectTodayRef);
      this.calendar.nextMonthBtn.addEventListener('click', this._nextMonthRef);
      this.calendar.prevMonthBtn.addEventListener('click', this._prevMonthRef);
      console.log(this.calendar.dayBtns);
      this.calendar.dayBtns.map(item => {
          item.addEventListener("click", (e) => this._selectDate(e));
        });
      window.addEventListener('click', this._windowClickRef);
      window.addEventListener('keyup', this._handleKeypressRef);
    }
    else {
      throw new InputError(`Element ${input} is not an input`);
    }
  }

  _init() {
    this._now = new Date();
    this._year = this._now.getFullYear();
    this._month = this._now.getMonth();
    this._currentDay = this._now.getDate();
    this._selectedDate = null;
    this._inputField = null;
    this._isOpened = false;
    this._isFocused = false;
    this._setId();
    this._bindMethods();
  }

  _bindMethods(){
    this._openRef = this.open.bind(this);
    this._closeRef = this.close.bind(this);
    this._onInputFocusRef = this._onInputFocus.bind(this);
    this._onInputBlurRef = this._onInputBlur.bind(this);
    this._handleKeypressRef = this._handleKeypress.bind(this);
    this._selectTodayRef = this._selectToday.bind(this);
    this._nextMonthRef = this._renderNextMonth.bind(this);
    this._prevMonthRef = this._renderPrevMonth.bind(this);
    this._windowClickRef = this._windowClick.bind(this);
  }

  _setId() {
    this._id = Math.random().toString(36).substr(2, 9);
  }

  _setMonth() {
    this._monthCounter = this._month;
  }

  _selectDate(e) {
    this._selectedDate = new Date(this._year, this._monthCounter, e.target.textContent);
    this._inputField.value = `${this._formator.setDateFormat(this._selectedDate)}`;
    this._render.getSelectedDate(this._selectedDate);
    this.close();
  }

  _selectToday(e) {
    e.stopPropagation();
    this._setMonth();

    if (this._now < this._minDate || this._now > this._maxDate) {
      this._render.update(this._isOpened, this._year, this._month);
      return;
    }

    this._selectedDate = new Date(this._year, this._month, this._currentDay);
    this._render.update(this._isOpened, this._year, this._month);
    this._inputField.value = `${this._currentDay}/${this._month + 1}/${this._year}`;
  }

  _renderNextMonth() {
    this._monthCounter = this._monthCounter + 1;
    this._render.update(this._isOpened, this._year, this._monthCounter);
  }

  _renderPrevMonth() {
    this._monthCounter = this._monthCounter - 1;
    this._render.update(this._isOpened, this._year, this._monthCounter);
  }

  _onInputFocus() {
    if(!this._isFocused) {
      this._isFocused = true;
    }
  }

  _onInputBlur() {
    if(this._isFocused) {
      this._isFocused = false;
    }
  }

  _windowClick(e) {
    if(e.target.nodeName.toLowerCase() === 'input' && e.which !== 27) {
      if (this._isOpened && e.target.getAttribute('id') !== this._id) {
        this.close();
      }
    }
    else {
      this.close();
    }
  }

  _handleKeypress(e) {
    const key = e.which || e.keyCode;

    switch(key) {
      case 13:
        if(this._isFocused) {
          this.open();
        }
        else if(!this._isFocused && e.target.nodeName.toLowerCase() === 'input' && e.target.getAttribute('id') !== this._id) {
          this.close();
        }
        break;

      case 27:
        this.close();
        break;

      case 39:
        this._renderNextMonth();
        break;

      case 37:
        this._renderPrevMonth();
        break;
    }
  }
}