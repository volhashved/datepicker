import { DateFormatError, DateValueError, InputError, RenderError } from './dp-errors.js';
import DPInitState from './dp-init-state.js';
import DPUpdateState from './dp-update-state.js';
import * as rxjs from 'rxjs';

export default class Datepicker {
  get minDate() {
    return this._minDate;
  }

  set minDate(minVal) {
    if (minVal instanceof Date) {
      if(minVal > this._maxDate) {
        throw new DateValueError(`Min date ${this._formatter.format(minVal)} can not be later than max date ${this._formatter.format(this._maxDate)}`);
      }
      this._minDate = minVal;
    }
    else {
      throw new DateFormatError(`Min date is type of ${minVal.constructor.name} but expected type is Date`);
    }
  }

  get maxDate() {
    return this._maxDate;
  }

  set maxDate(maxVal) {
    if (maxVal instanceof Date) {
      if(maxVal < this._minDate) {
        throw new DateValueError(`Min date ${this._formatter.format(this._minDate)} can not be later than max date ${this._formatter.format(maxVal)}`);
      }
      this._maxDate = maxVal;
    }
    else {
      throw new DateFormatError(`Max date is type of ${maxVal.constructor.name} but expected type is Date`);
    }
  }

  get selectedDate() {
    return this._selectedDate;
  }

  set selectedDate(newDate) {
    if (newDate instanceof Date) {
      if(newDate < this._minDate || newDate > this._maxDate) {
        throw new DateValueError(`Selected date ${this._formatter.format(newDate)} should be between min ${this._formatter.format(this._minDate)} and max ${this._formatter.format(this._maxDate)} dates`);
      }
      this._selectedDate = newDate;
    }
    else {
      throw new DateFormatError(`Selected date is type of ${newDate.constructor.name} but expected type is Date`);
    }
  }

  get onSelectedDateChange$() {
    return this._onSelectedDateChange$.asObservable();
  }

  constructor (minDate, maxDate, render, formatter) {
    this._formatter = formatter;
    this._minDate = new Date(new Date().getFullYear(), 0, 1);
    this._maxDate = new Date(new Date().getFullYear(), 12, 0);
    this.minDate = minDate || this._minDate;
    this.maxDate = maxDate || this._maxDate;
    this._render = render;
    this._init();

    this._onSelectedDateChange$ = new rxjs.Subject();
  }

  open() {
    if(this._render.isRendered) {
      this._isOpened = true;
      if(!this._selectedDate) {
        this._setMonth();
        const dpUpdateState = new DPUpdateState(this._isOpened, new Date(), this._selectedDate);
        this._render.update(dpUpdateState);
      }
      else {
        this._month = this._selectedDate.getMonth();
        const date = new Date(this._selectedDate.getFullYear(), this._month);
        const dpUpdateState = new DPUpdateState(this._isOpened, date, this._selectedDate);
        this._render.update(dpUpdateState);
        this._inputField.value = `${this._formatter.format(this._selectedDate)}`;
      }
    }
    else {
      throw new RenderError('Calendar is not rendered');
    }
  }

  close() {
      this._isOpened = false;
      this._render.update(this._isOpened);
  }

  destroy() {
    if(this._render.isRendered) {
      this._inputField.removeEventListener('click', this._openRef);
      this._inputField.removeEventListener('focus', this._onInputFocusRef);
      this._inputField.removeEventListener('blur', this._onInputBlurRef);
      this._inputField.removeEventListener('keypress', this._onInputPressRef);
      this._calendar.todayRef.removeEventListener('click', this._selectTodayRef);
      this._calendar.nextMonthRef.removeEventListener('click', this._nextMonthRef);
      this._calendar.prevMonthRef.removeEventListener('click', this._prevMonthRef);
      this._calendar.daysRef.map(item => item.removeEventListener("click", this._selectDateRef));
      window.removeEventListener('click', this._windowClickRef);
      window.removeEventListener('keyup', this._handleKeypressRef);
      this._render.destroy();
    }
  }

  render(input) {
    if(input && input.nodeName && input.nodeName.toLowerCase() === 'input') {
      this._inputField = input;
      this._setMonth();
      const dpInitState = new DPInitState(input, this._formatter, this.minDate, this.maxDate);
      this._calendar = this._render.create(dpInitState);
      this._renderErrorField();
      this._inputField.setAttribute('id', `${this._id}`);
      this._inputField.addEventListener('click', this._openRef);
      this._inputField.addEventListener('focus', this._onInputFocusRef);
      this._inputField.addEventListener('blur', this._onInputBlurRef);
      this._inputField.addEventListener('keypress', this._onInputPressRef);
      this._calendar.todayRef.addEventListener('click', this._selectTodayRef);
      this._calendar.nextMonthRef.addEventListener('click', this._nextMonthRef);
      this._calendar.prevMonthRef.addEventListener('click', this._prevMonthRef);
      this._calendar.daysRef.map(item => item.addEventListener("click", this._selectDateRef));
      window.addEventListener('click', this._windowClickRef);
      window.addEventListener('keyup', this._handleKeypressRef);
    }
    else {
      throw new InputError(`Enter a valid input`);
    }
  }

  _init() {
    this._selectedDate = null;
    this._inputField = null;
    this._isOpened = false;
    this._isFocused = false;
    this._inputInvalid = false;
    this._setId();
    this._bindMethods();
  }

  _bindMethods(){
    this._openRef = this.open.bind(this);
    this._closeRef = this.close.bind(this);
    this._onInputFocusRef = this._onInputFocus.bind(this);
    this._onInputBlurRef = this._onInputBlur.bind(this);
    this._onInputPressRef = this._onInputPress.bind(this);
    this._handleKeypressRef = this._handleKeypress.bind(this);
    this._selectTodayRef = this._selectToday.bind(this);
    this._selectDateRef = this._selectDate.bind(this);
    this._nextMonthRef = this._renderNextMonth.bind(this);
    this._prevMonthRef = this._renderPrevMonth.bind(this);
    this._windowClickRef = this._windowClick.bind(this);
  }

  _setId() {
    this._id = Math.random().toString(36).substr(2, 9);
  }

  _setMonth() {
    this._month = new Date().getMonth();
  }

  set __selectedDate(newDate) {
    this._selectedDate = newDate;
    this._onSelectedDateChange$.next(this._selectedDate);
  }

  set inputValue(date) {
    this._inputField.value = `${this._formatter.format(date)}`;
  }

  _selectDate(e) {
    if(this._inputInvalid) {
      this._inputInvalid = false;
      this._hideErrorMessage();
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    this.__selectedDate = new Date(currentYear, this._month, e.target.textContent);
    this.inputValue = this._selectedDate;
    const dpUpdateState = new DPUpdateState(this._isOpened, this._selectedDate, this._selectedDate);
    this._render.update(dpUpdateState);
    this.close();
  }

  _selectToday(e) {
    e.stopPropagation();
    this._setMonth();

    if(this._inputInvalid) {
      this._inputInvalid = false;
      this._hideErrorMessage();
    }

    if (new Date() < this._minDate || new Date() > this._maxDate) {
      const dpUpdateState = new DPUpdateState(this._isOpened, new Date(), this._selectedDate);
      this._render.update(dpUpdateState);
    }
    else {
      this.__selectedDate = new Date();
      const dpUpdateState = new DPUpdateState(this._isOpened, new Date(), this._selectedDate);
      this._render.update(dpUpdateState);
      this._inputField.value = this._formatter.format(new Date());
    }
  }

  _renderNextMonth() {
    const now = new Date();
    const currentYear = now.getFullYear();

    this._month = this._month + 1;
    const date = new Date(currentYear, this._month);
    const dpUpdateState = new DPUpdateState(this._isOpened, date, this._selectedDate);
    this._render.update(dpUpdateState);
  }

  _renderPrevMonth() {
    const now = new Date();
    const currentYear = now.getFullYear();

    this._month = this._month - 1;
    const date = new Date(currentYear, this._month);
    const dpUpdateState = new DPUpdateState(this._isOpened, date, this._selectedDate);
    this._render.update(dpUpdateState);
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

  _onInputPress(e) {
    const key = e.which || e.keyCode;
    if(key === 13) {
      const inputValue = e.target.value;
      const re = /^([0-2]?[\d]|3[0-1])(\/)(0?[0-9]{1}|1[0-2])(\/)[0-9]{4}$/;
      if(!re.test(inputValue)) {
        this._inputInvalid = true;
        this._showErrorMessage(inputValue);
      }
      else {
        this._inputInvalid = false;
        this._hideErrorMessage();
        const dateArr = inputValue.split("/");
        let date = new Date(dateArr[2], dateArr[1]-1, dateArr[0]);
        if(date < this._minDate || date > this._maxDate) {
          throw new DateValueError(`Selected date ${this._formatter.format(date)} should be between min ${this._formatter.format(this._minDate)} and max ${this._formatter.format(this._maxDate)} dates`);
        }
        else {
          this.__selectedDate = date;
        }
      }
    }
  }

  _renderErrorField() {
    this._errorMessage = document.createElement('div');
    this._errorMessage.className = "input__error input__error_hidden";
    this._inputField.parentNode.insertBefore(this._errorMessage, this._inputField.nextSibling);
  }

  _showErrorMessage(inputValue) {
    this._inputField.classList.add('input_invalid');
    this._errorMessage.classList.remove('input__error_hidden');
    this._errorMessage.innerHTML = `Date format ${inputValue} is invalid, valid date format is dd/mm/yyyy`;
  }

  _hideErrorMessage() {
    this._inputField.classList.remove('input_invalid');
    this._errorMessage.classList.add('input__error_hidden');
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
        if(!this._isFocused) {
          this._renderNextMonth();
        }
        break;

      case 37:
        if(!this._isFocused) {
          this._renderPrevMonth();
        }
        break;
    }
  }
}