'use strict';

class Datepicker {
    constructor (minDate = new Date(new Date().getFullYear(), 0, 1), maxDate = new Date(new Date().getFullYear(), 12, 0)) {
        this.minDate = minDate;
        this.maxDate = maxDate;
        this._now = new Date();
        this._year = null;
        this._month = null;
        this._currentDay = null;
        this._selectedDate = null;
        this._inputField = null;
        this._isOpened = false;
        this._weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        this._monthDates = [];
        this._openRef = this.open.bind(this);
        this._closeRef = this.close.bind(this);
        this._selectTodayRef = this._selectToday.bind(this);
        this._nextMonthRef = this._renderNextMonth.bind(this);
        this._prevMonthRef = this._renderPrevMonth.bind(this);
        this._stopBubblingRef = this._stopBubbling.bind(this);
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

    get minDate() {
        return this._minDate;
    }

    set minDate(minVal) {
        if (minVal instanceof Date) {
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
                throw new DateValueError("Min date can not be later than max date");
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
                throw new DateValueError("Selected date should be between min and max date");
            }
            this._selectedDate = newDate;
        }
        else {
            throw new DateFormatError("Enter a valid date format");
        }
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
        this._calendarLabel = document.createElement("button");
        this._calendarLabel.className = "calendar__label";
        this._calendarLabel.setAttribute("title", "Today");
        this._calendar.appendChild(this._calendarLabel);
        this._calendarLabel.innerHTML = `${this._currentDay}/${this._month+1}/${this._year}`;
    }

    _renderHeader() {
        this._calendarHeader = document.createElement("div");
        this._calendarHeader.className = "calendar__header";
        this._calendar.appendChild(this._calendarHeader);

        this._previousMonthBtn = document.createElement("button");
        this._previousMonthBtn.className = "calendar__button calendar__button_prev";
        this._previousMonthBtn.setAttribute("title", "Previous month");
        this._calendarHeader.appendChild(this._previousMonthBtn);

        this._activeMonth = document.createElement("div");
        this._activeMonth.className = "calendar__month";
        this._calendarHeader.appendChild(this._activeMonth);

        this._nextMonthBtn = document.createElement("button");
        this._nextMonthBtn.className = "calendar__button calendar__button_next";
        this._nextMonthBtn.setAttribute("title", "Next month");
        this._calendarHeader.appendChild(this._nextMonthBtn);
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
            calendarDay.className = "calendar__date calendar__date_disabled";
            calendarDay.innerHTML = "";
            this._calendarTable.appendChild(calendarDay);
        }

        for(let i = 1; i <= lastDay; i++) {
            const calendarDay = document.createElement("div");
            calendarDay.className = "calendar__date";
            this._monthDates.push(calendarDay);
            const theDate = new Date(yearPar, monthPar, i);

            if(theDate < this._minDate || theDate > this._maxDate) {
                calendarDay.className += " calendar__date_disabled";
            }
            else {
                calendarDay.className += " calendar__date_active";
            }

            if(yearPar === this._year && monthPar === this._month && i === this._currentDay) {
                calendarDay.className += " calendar__date_today";
            }

            if(+theDate === +this._selectedDate) {
                calendarDay.className += " calendar__date_selected";
            }

            calendarDay.innerHTML = `${i}`;
            this._calendarTable.appendChild(calendarDay);
        }
        this._selectDate();

        if (ltweekday === 0) return;
        for(let i = ltweekday; i < 7; i++) {
            const calendarDay = document.createElement("div");
            calendarDay.className = "calendar__date calendar__date_disabled";
            calendarDay.innerHTML = "";
            this._calendarTable.appendChild(calendarDay);
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
                this._inputField.value = `${this._selectedDate.getDate()}/${this._selectedDate.getMonth()+1}/${this._selectedDate.getFullYear()}`;
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

    open(e) {
        e.stopPropagation();

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
       if (this._isOpened) {
            this._datePicker.classList.add('datepicker_hidden');
            this._isOpened = false;
       }
    }

    destroy() {
        this._inputField.removeEventListener("click", this._openRef);
        this._calendarLabel.removeEventListener("click", this._selectTodayRef);
        this._nextMonthBtn.removeEventListener("click", this._nextMonthRef);
        this._previousMonthBtn.removeEventListener("click", this._prevMonthRef);
        this._calendar.removeEventListener("click", this._stopBubbling);
        window.removeEventListener("click", this._closeRef);
        this._datePicker.parentNode.removeChild(this.datePicker);
    }

    render(input) {
        if(input) {
            this._inputField = input;
            this._inputField.addEventListener("click", this._openRef);
            this._setYear();
            this._setMonth();
            this._setCurrentDay();
            this._renderCalendar();
            this._calendarLabel.addEventListener("click", this._selectTodayRef);
            this._nextMonthBtn.addEventListener("click", this._nextMonthRef);
            this._previousMonthBtn.addEventListener("click", this._prevMonthRef);
            this._calendar.addEventListener("click", this._stopBubbling);
            window.addEventListener("click", this._closeRef);
        }
        else {
            throw new InputError("Input is not found");
        }
    }
}

class DateFormatError extends Error {
    constructor(message) {
       super(message);
       this.name = "DateFormatError";
    }
}

class DateValueError extends Error {
    constructor(message) {
       super(message);
       this.name = "DateValueError";
    }
}

class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputError";
    }
}