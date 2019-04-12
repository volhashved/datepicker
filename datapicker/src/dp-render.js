export default class Render {
  constructor (minDate, maxDate) {
    this._minDate = minDate;
    this._maxDate = maxDate;
    this._weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    this._monthDates = [];
    this._now = new Date();
    this._year = this._now.getFullYear();
    this._month = this._now.getMonth();
    this._currentDay = this._now.getDate();
  }

  render(input, select) {
    this._inputField = input;
    this._select = select;
    this._renderCalendar();
  }

  getMonthCount(counter) {
    this._monthCounter = counter;
  }

  getSelectedDate(date) {
    this._selectedDate = date;
  }

  openCalendar() {
    this._datePicker.classList.remove('datepicker_hidden');
  }

  closeCalendar() {
    this._datePicker.classList.add('datepicker_hidden');
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

  renderCalendarDates(yearPar, monthPar) {
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

    this._monthDates.map(item => {
      item.addEventListener("click", (e) => this._select(e));
    });

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
}