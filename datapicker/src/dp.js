import { DateFormatError, DateValueError, InputError } from './dp-errors.js';

import Render from './dp-render.js';

export default class Datepicker {
  get minDate() {
    return this._minDate;
  }

  set minDate(minVal) {
    if (minVal instanceof Date) {
      if(minVal > this._maxDate) {
        throw new DateValueError(`Min date  ${this._setDateFormat(minVal)} can not be later than max date ${this._setDateFormat(this._maxDate)}`);
      }
      this._minDate = minVal;
    }
    else {
      throw new DateFormatError("Enter a valid date format");
    }
  }

  get maxDate() {
    return this._maxDate;
  }

  set maxDate(maxVal) {
    if (maxVal instanceof Date) {
      if(maxVal < this._minDate) {
        throw new DateValueError(`Min date ${this._setDateFormat(this._minDate)} can not be later than max date ${this._setDateFormat(maxVal)}`);
      }
      this._maxDate = maxVal;
    }
    else {
      throw new DateFormatError("Enter a valid date format");
    }
  }

  get selectedDate() {
    return this._selectedDate;
  }

  set selectedDate(newDate) {
    if (newDate instanceof Date) {
      if(newDate < this._minDate || newDate > this._maxDate) {
        throw new DateValueError(`Selected date ${this._setDateFormat(newDate)} should be between min ${this._setDateFormat(this._minDate)} and max ${this._setDateFormat(this._maxDate)} dates`);
      }
      this._selectedDate = newDate;
    }
    else {
      throw new DateFormatError("Enter a valid date format");
    }
  }

  constructor (minDate, maxDate) {
    this._minDate = new Date(new Date().getFullYear(), 0, 1);
    this._maxDate = new Date(new Date().getFullYear(), 12, 0);
    this.minDate = minDate || this._minDate;
    this.maxDate = maxDate || this._maxDate;
    this._manageRender = new Render();
    this._init();
  }

  open() {
    if(this._isRendered) {
      if(!this._selectedDate) {
        this._setMonth();
        this._renderCalendarDates(this._year, this._month);
      }
      else {
        this._monthCounter = this._selectedDate.getMonth();
        this._renderCalendarDates(this._selectedDate.getFullYear(), this._selectedDate.getMonth(), this._selectedDate.getDate());
        this._inputField.value = `${this._selectedDate.getDate()}/${this._selectedDate.getMonth()+1}/${this._selectedDate.getFullYear()}`;
      }

      if(!this._isOpened) {
        this._datePicker.classList.remove('datepicker_hidden');
        this._isOpened = true;
      }
    }
  }

  close() {
    if(this._isOpened) {
      this._datePicker.classList.add('datepicker_hidden');
      this._isOpened = false;
    }
  }

  destroy() {
    if(this._inputField) {
      this._inputField.removeEventListener("click", this._openRef);
      this._inputField.removeEventListener("focus", this._onInputFocusRef);
      this._inputField.removeEventListener("blur", this._onInputBlurRef);
      this._todayLabelBtn.removeEventListener("click", this._selectTodayRef);
      this._nextMonthBtn.removeEventListener("click", this._nextMonthRef);
      this._previousMonthBtn.removeEventListener("click", this._prevMonthRef);
      this._calendar.removeEventListener("click", this._stopBubbling);
      window.removeEventListener("click", this._windowClickRef);
      window.removeEventListener("keyup", this._handleKeypressRef);
      this._datePicker.parentNode.removeChild(this._datePicker);
      this._monthDates.map(item => {
        item.removeEventListener("click", this._setSelectedDateRef);
      });
    }
  }

  render(input) {
    if(!input) throw new InputError("There is no valid input");
    if(input.nodeName && input.nodeName.toLowerCase() === "input") {
      this._inputField = input;
      this._isRendered = true;
      this._setYear();
      this._setMonth();
      this._setCurrentDay();
      this._renderCalendar();
      this._inputField.setAttribute("id", `${this._id}`);
      this._inputField.addEventListener("click", this._openRef);
      this._inputField.addEventListener("focus", this._onInputFocusRef);
      this._inputField.addEventListener("blur", this._onInputBlurRef);
      this._todayLabelBtn.addEventListener("click", this._selectTodayRef);
      this._nextMonthBtn.addEventListener("click", this._nextMonthRef);
      this._previousMonthBtn.addEventListener("click", this._prevMonthRef);
      this._calendar.addEventListener("click", this._stopBubbling);
      window.addEventListener("click", this._windowClickRef);
      window.addEventListener("keyup", this._handleKeypressRef);
    }
    else {
      throw new InputError(`Element ${input} is not an input`);
    }
  }

  _init() {
    this._now = new Date();
    this._year = null;
    this._month = null;
    this._currentDay = null;
    this._selectedDate = null;
    this._inputField = null;
    this._isRendered = false;
    this._isOpened = false;
    this._isFocused = false;
    this._weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    this._monthDates = [];
    this._setId();
    this._bindMethods();
  }

  _bindMethods(){
    this._renderCalendar = this._manageRender._renderCalendar.bind(this);
    this._renderLabel = this._manageRender._renderLabel.bind(this);
    this._renderHeader = this._manageRender._renderHeader.bind(this);
    this._renderCalendarTable = this._manageRender._renderCalendarTable.bind(this);
    this._renderCalendarDates = this._manageRender._renderCalendarDates.bind(this);
    this._renderNextMonth = this._manageRender._renderNextMonth.bind(this);
    this._renderPrevMonth = this._manageRender._renderPrevMonth.bind(this);
    this._openRef = this.open.bind(this);
    this._closeRef = this.close.bind(this);
    this._onInputFocusRef = this._onInputFocus.bind(this);
    this._onInputBlurRef = this._onInputBlur.bind(this);
    this._handleKeypressRef = this._handleKeypress.bind(this);
    this._selectTodayRef = this._selectToday.bind(this);
    this._setSelectedDateRef = this._setSelectedDate.bind(this);
    this._nextMonthRef = this._renderNextMonth.bind(this);
    this._prevMonthRef = this._renderPrevMonth.bind(this);
    this._stopBubblingRef = this._stopBubbling.bind(this);
    this._windowClickRef = this._windowClick.bind(this);
  }

  _setId() {
    this._id = Math.random().toString(36).substr(2, 9);
  }

  _setDateFormat(date) {
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
  }

  _setYear() {
    this._year = this._now.getFullYear();
  }

  _setMonth() {
    this._month = this._now.getMonth(); 
    this._monthCounter = this._month;
  }

  _setCurrentDay() {
    this._currentDay = this._now.getDate();
  }

  _selectDate() {
    this._monthDates.map(item => {
      item.addEventListener("click", this._setSelectedDateRef);
    });
  }

  _setSelectedDate(e) {
    this._selectedDate = new Date(this._year, this._monthCounter, e.target.textContent);
    this._inputField.value = `${this._setDateFormat(this._selectedDate)}`;
    this.close();
  }

  _selectToday(e) {
    e.stopPropagation();
    this._setMonth();

    if (this._now < this._minDate || this._now > this._maxDate) {
      this._renderCalendarDates(this._year, this._month);
      return;
    }

    this._selectedDate = new Date(this._year, this._month, this._currentDay);
    this._renderCalendarDates(this._year, this._month);
    this._inputField.value = `${this._currentDay}/${this._month + 1}/${this._year}`;
  }

  _stopBubbling(e) {
    e.stopPropagation();
  }

  _onInputFocus() {
    if(!this._isFocused) {
      this._isFocused = true
    }
  }

  _onInputBlur() {
    if(this._isFocused) {
      this._isFocused = false
    }
  }

  _windowClick(e) {
    if(e.target.nodeName.toLowerCase() === "input" && e.which !== 27) {
      if (this._isOpened && e.target.getAttribute("id") !== this._id) {
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
        else if(!this._isFocused && e.target.nodeName.toLowerCase() === 'input' && e.target.getAttribute("id") !== this._id) {
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