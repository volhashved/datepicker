import { DateFormatError, DateValueError, InputError } from './dp-errors.js';

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
    this._init();
  }

  open() {
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
    }
  }

  render(input) {
    if(!input) throw new InputError("There is no valid input");
    if(input.nodeName && input.nodeName.toLowerCase() === "input") {
      this._inputField = input;
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
    this._isOpened = false;
    this._isFocused = false;
    this._weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    this._monthDates = [];
    this._setId();
    this._openRef = this.open.bind(this);
    this._closeRef = this.close.bind(this);
    this._onInputFocusRef = this._onInputFocus.bind(this);
    this._onInputBlurRef = this._onInputBlur.bind(this);
    this._handleKeypressRef = this._handleKeypress.bind(this);
    this._selectTodayRef = this._selectToday.bind(this);
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

  _renderCalendar() {
    this._datePicker = document.createElement("div");
    this._datePicker.className = "datepicker datepicker_hidden";
    this._inputField.parentNode.insertBefore(this._datePicker, this._inputField.nextSibling);

    this._calendar = document.createElement("div");
    this._calendar.className = "calendar";
    this._datePicker.appendChild(this._calendar);

    this._renderLabel();
    this._renderHeader();
    this._renderCalendarTable();
  }

  _renderLabel() {
    this._todayLabel = document.createElement("div");
    this._todayLabel.className = "today";
    this._calendar.appendChild(this._todayLabel);

    this._todayLabelBtn = document.createElement("button");
    this._todayLabelBtn.className = "today__btn";
    this._todayLabelBtn.setAttribute("title", "Today");
    this._todayLabel.appendChild(this._todayLabelBtn);
    this._todayLabelBtn.innerHTML = `${this._currentDay}/${this._month+1}/${this._year}`;
  }

  _renderHeader() {
    this._calendarHeader = document.createElement("div");
    this._calendarHeader.className = "calendar__header";
    this._calendar.appendChild(this._calendarHeader);

    this._previousMonth = document.createElement("div");
    this._previousMonth.className = "month-change";
    this._calendarHeader.appendChild(this._previousMonth);

    this._previousMonthBtn = document.createElement("button");
    this._previousMonthBtn.className = "month-change__btn month-change__btn_prev";
    this._previousMonthBtn.setAttribute("title", "Previous month");
    this._previousMonth.appendChild(this._previousMonthBtn);

    this._activeMonth = document.createElement("div");
    this._activeMonth.className = "calendar__month";
    this._calendarHeader.appendChild(this._activeMonth);

    this._nextMonth = document.createElement("div");
    this._nextMonth.className = "month-change";
    this._calendarHeader.appendChild(this._nextMonth);

    this._nextMonthBtn = document.createElement("button");
    this._nextMonthBtn.className = "month-change__btn month-change__btn_next";
    this._nextMonthBtn.setAttribute("title", "Next month");
    this._nextMonth.appendChild(this._nextMonthBtn);
  }

  _renderCalendarTable() {
    this._calendarDates = document.createElement("ul");
    this._calendarDates.className = "calendar__days";
    this._calendar.appendChild(this._calendarDates);

    this._weekDays.forEach((item) => {
      const wkDay = document.createElement("li");
      wkDay.textContent = item;
      this._calendarDates.appendChild(wkDay);
    });

    this._calendarTable = document.createElement("div");
    this._calendarTable.className = "calendar__table";
    this._calendar.appendChild(this._calendarTable);
  }

  _renderCalendarDates(yearPar, monthPar) {
    this._activeMonth.innerHTML = `${(new Date(yearPar, monthPar)).toLocaleString("en", {
      year: 'numeric',
      month: 'long'
    })}`;

    const lastDay = (new Date(yearPar, monthPar + 1, 0)).getDate();
        
    let stweekDay = (new Date(yearPar, monthPar, 1)).getDay();
    if (stweekDay === 0) {
      stweekDay = 7;
    }

    const ltweekday = (new Date(yearPar, monthPar, lastDay)).getDay();

    this._calendarTable.innerHTML = "";

    for(let i = 1; i < stweekDay; i++) {
      const calendarDay = document.createElement("div");
      calendarDay.className = "date";
      const calendarDayBtn = document.createElement("button");
      calendarDayBtn.className = "date__btn date__btn_disabled";
      calendarDayBtn.setAttribute("disabled", "");
      calendarDayBtn.innerHTML = "";
      this._calendarTable.appendChild(calendarDay);
      calendarDay.appendChild(calendarDayBtn);
    }

    for(let i = 1; i <= lastDay; i++) {
      const calendarDay = document.createElement("div");
      calendarDay.className = "date";

      const calendarDayBtn = document.createElement("button");
      calendarDayBtn.className = "date__btn";

      this._monthDates.push(calendarDayBtn);
      const theDate = new Date(yearPar, monthPar, i);

      if(theDate < this._minDate || theDate > this._maxDate) {
        calendarDayBtn.setAttribute("disabled", "");
        calendarDayBtn.className += " date__btn_disabled";
      }

      if(yearPar === this._year && monthPar === this._month && i === this._currentDay) {
        calendarDayBtn.className += " date__btn_today";
      }

      if(+theDate === +this._selectedDate) {
        calendarDayBtn.className += " date__btn_selected";
      }

      calendarDayBtn.innerHTML = `${i}`;
      this._calendarTable.appendChild(calendarDay);
      calendarDay.appendChild(calendarDayBtn);
    }
    this._selectDate();

    if (ltweekday === 0) return;
    for(let i = ltweekday; i < 7; i++) {
      const calendarDay = document.createElement("div");
      calendarDay.className = "date";
      const calendarDayBtn = document.createElement("button");
      calendarDayBtn.className = "date__btn date__btn_disabled";
      calendarDayBtn.setAttribute("disabled", "");
      calendarDayBtn.innerHTML = "";
      this._calendarTable.appendChild(calendarDay);
      calendarDay.appendChild(calendarDayBtn);
    }
  }

  _renderNextMonth() {
    this._monthCounter = this._monthCounter + 1;
    this._renderCalendarDates(this._year, this._monthCounter);
  }

  _renderPrevMonth() {
    this._monthCounter = this._monthCounter - 1;
    this._renderCalendarDates(this._year, this._monthCounter);
  }

  _selectDate() {
    this._monthDates.map(item => {
      item.addEventListener("click", (e) => {
        this._selectedDate = new Date(this._year, this._monthCounter, e.target.textContent);
        this._inputField.value = `${this._setDateFormat(this._selectedDate)}`;
        this.close();
      });
    });
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
        else {
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