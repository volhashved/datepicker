export default class Render {
  constructor () {
    this._monthDates = [];
    this._isRendered = false;
    this._selectedDate = null;
  }

  set _now(now) {
    this._year = now.getFullYear();
    this._month = now.getMonth();
    this._currentDay = now.getDate();
  }

  create({input, formatter, minDate, maxDate}) {
    this._inputField = input;
    this._formatter = formatter;
    this._minDate = minDate;
    this._maxDate = maxDate;
    this._stopBubblingRef = this._stopBubbling.bind(this);
    this._renderCalendar();

    return {
      todayRef: this._todayLabelBtn,
      nextMonthRef: this._nextMonthBtn,
      prevMonthRef: this._previousMonthBtn,
      daysRef: this._monthDates
    }
  }

  update({isOpened, calendarDate, selectedDate}) {
    if(isOpened) {
      this._now = new Date();
      this._selectedDate = selectedDate;
      this._setLabelValue();
      this._renderCalendarDates(calendarDate);
      this._openCalendar();
    }
    else {
      this._closeCalendar();
    }
  }

  isRendered() {
    this._isRendered = true;
  }

  destroy() {
    this._calendar.removeEventListener('click', this._stopBubblingRef);
    this._datePicker.parentNode.removeChild(this._datePicker);
  }

  _openCalendar() {
    this._datePicker.classList.remove('datepicker_hidden');
  }

  _closeCalendar() {
    this._datePicker.classList.add('datepicker_hidden');
  }

  _stopBubbling(e) {
    e.stopPropagation();
  }

  _renderCalendar() {
    this._datePicker = document.createElement("div");
    this._datePicker.className = "datepicker datepicker_hidden";
    this._inputField.parentNode.insertBefore(this._datePicker, this._inputField.nextSibling);

    this._calendar = document.createElement("div");
    this._calendar.className = "calendar";
    this._datePicker.appendChild(this._calendar);

    this._calendar.addEventListener('click', this._stopBubblingRef);

    this._renderLabel();
    this._renderHeader();
    this._renderCalendarTable();
    this._renderCalendarCells();
  }

  _renderLabel() {
    this._todayLabel = document.createElement("div");
    this._todayLabel.className = "today";
    this._calendar.appendChild(this._todayLabel);

    this._todayLabelBtn = document.createElement("button");
    this._todayLabelBtn.className = "today__btn";
    this._todayLabelBtn.setAttribute("title", "Today");
    this._todayLabel.appendChild(this._todayLabelBtn);
  }

  _setLabelValue() {
    this._todayLabelBtn.innerHTML = this._formatter.format(new Date());
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

    this._formatter.weekDays.forEach((item) => {
      const wkDay = document.createElement("li");
      wkDay.textContent = item;
      this._calendarDates.appendChild(wkDay);
    });

    this._calendarTable = document.createElement("div");
    this._calendarTable.className = "calendar__table";
    this._calendar.appendChild(this._calendarTable);
  }

  _renderCalendarCells() {
    for(let i = 0; i < 42; i++) {
      const calendarDay = document.createElement("div");
      calendarDay.className = "date";

      const calendarDayBtn = document.createElement("button");
      calendarDayBtn.className = "date__btn";

      this._monthDates.push(calendarDayBtn);
      this._calendarTable.appendChild(calendarDay);
      calendarDay.appendChild(calendarDayBtn);
    }
  }

  _renderCalendarDates(date) {
    const yearPar = date.getFullYear();
    const monthPar = date.getMonth();
    this._activeMonth.innerHTML = this._formatter.formatActiveMonth(date);

    const lastDay = (new Date(yearPar, monthPar + 1, 0)).getDate();

    let stweekDay = (new Date(yearPar, monthPar, 1)).getDay();
    if (stweekDay === 0) {
      stweekDay = 7;
    }

    let ltweekday = (new Date(yearPar, monthPar, lastDay)).getDay();

    for(var i = 0; i < this._monthDates.length; i++) {
      this._monthDates[i].innerHTML = "";
      this._monthDates[i].className = "date__btn date__btn_disabled";
      this._monthDates[i].setAttribute("disabled", "");
      this._monthDates[i].parentNode.className = "date";

      if(i >= stweekDay - 1 && i < lastDay+stweekDay - 1) {
        this._monthDates[i].className = "date__btn";
        this._monthDates[i].removeAttribute("disabled", "");
        const theDate = new Date(yearPar, monthPar, i-stweekDay+2);

        if(theDate < this._minDate || theDate > this._maxDate) {
          this._monthDates[i].setAttribute("disabled", "");
          this._monthDates[i].className += " date__btn_disabled";
        }

        if(yearPar === this._year && monthPar === this._month && i-stweekDay+2 === this._currentDay) {
          this._monthDates[i].className += " date__btn_today";
        }

        if(+theDate === +this._selectedDate) {
          this._monthDates[i].className += " date__btn_selected";
        }

        this._monthDates[i].innerHTML = `${i-stweekDay+2}`;

        if (ltweekday === 0) {
          ltweekday = 7;
        }
      }
      else if(i >= lastDay + (stweekDay - 1) + (7 - ltweekday)) {
        this._monthDates[i].parentNode.className = "datepicker_hidden";
      }
    }
  }
}