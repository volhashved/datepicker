'use strict';

class Datepicker {
    constructor (minDate = new Date(new Date().getFullYear(), 0, 1), maxDate = new Date(new Date().getFullYear(), 12, 0)) {
        this.minDate = minDate;
        this.maxDate = maxDate;
        this._selectedDate = null;
        this._inputField = null;
        this._isOpened = false;
        this._now = new Date();
        this._weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        this._monthDates = [];
    }

    _setYear() {
        this.year = this._now.getFullYear();
    }

    _setMonth() {
        this.month = this._now.getMonth(); 
        this.monthCounter = this.month;
    }

    _setCurrentDay() {
        this.currentDay = this._now.getDate();
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
        this.datePicker = document.createElement("div");
        this.datePicker.className = "datepicker";
        this._inputField.parentNode.insertBefore(this.datePicker, this._inputField.nextSibling);

        this.calendWrap = document.createElement("div");
        this.calendWrap.className = "datepicker__content";
        this.datePicker.appendChild(this.calendWrap);

        this.calendar = document.createElement("div");
        this.calendar.className = "calendar calendar_hidden";
        this.calendWrap.appendChild(this.calendar);

        this._renderLabel();
        this._renderHeader();
        this._renderCalendarTable();
    }

    _renderLabel() {
        this.calendarLabel = document.createElement("h2");
        this.calendarLabel.className = "calendar__label";
        this.calendar.appendChild(this.calendarLabel);
        this.calendarLabel.innerHTML = `${this.currentDay}/${this.month+1}/${this.year}`;
    }

    _renderHeader() {
        this.calendarHeader = document.createElement("div");
        this.calendarHeader.className = "calendar__header";
        this.calendar.appendChild(this.calendarHeader);

        this.previousMonthBtn = document.createElement("button");
        this.previousMonthBtn.className = "calendar__button calendar__button_prev";
        this.calendarHeader.appendChild(this.previousMonthBtn);

        this.activeMonth = document.createElement("h3");
        this.activeMonth.className = "calendar__month";
        this.calendarHeader.appendChild(this.activeMonth);

        this.nextMonthBtn = document.createElement("button");
        this.nextMonthBtn.className = "calendar__button calendar__button_next";
        this.calendarHeader.appendChild(this.nextMonthBtn);
    }

    _renderCalendarTable() {
        this.calendarDates = document.createElement("ul");
        this.calendarDates.className = "calendar__days";
        this.calendar.appendChild(this.calendarDates);

        this._weekDays.forEach((item) => {
            const wkDay = document.createElement("li");
            wkDay.textContent = item;
            this.calendarDates.appendChild(wkDay);
        });

        this.calendarTable = document.createElement("div");
        this.calendarTable.className = "calendar__table";
        this.calendar.appendChild(this.calendarTable);
    }

    _renderCalendarDates(yearPar, monthPar) {
        this.activeMonth.innerHTML = `${(new Date(yearPar, monthPar)).toLocaleString("en", {
            year: 'numeric',
            month: 'long'
        })}`;

        const lastDay = (new Date(yearPar, monthPar + 1, 0)).getDate();
        
        let stweekDay = (new Date(yearPar, monthPar, 1)).getDay();
        if (stweekDay === 0) {
            stweekDay = 7;
        }

        const ltweekday = (new Date(yearPar, monthPar, lastDay)).getDay();

        this.calendarTable.innerHTML = "";

        for(let i = 1; i < stweekDay; i++) {
            const calendarDay = document.createElement("div");
            calendarDay.className = "calendar__date calendar__date_disabled";
            calendarDay.innerHTML = "";
            this.calendarTable.appendChild(calendarDay);
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

            if(yearPar === this.year && monthPar === this.month && i === this.currentDay) {
                calendarDay.className += " calendar__date_today";
            }        
            
            if(+theDate === +this._selectedDate) {
                calendarDay.className += " calendar__date_selected";
            }

            calendarDay.innerHTML = `${i}`;
            this.calendarTable.appendChild(calendarDay);
        }
        this._selectDate();

        if (ltweekday === 0) return;
        for(let i = ltweekday; i < 7; i++) {
            const calendarDay = document.createElement("div");
            calendarDay.className = "calendar__date calendar__date_disabled";
            calendarDay.innerHTML = "";
            this.calendarTable.appendChild(calendarDay);
        }
    }

    _renderNextMonth() {
        this.monthCounter = this.monthCounter + 1;
        this._renderCalendarDates(this.year, this.monthCounter);
    }

    _renderPrevMonth() {
        this.monthCounter = this.monthCounter - 1;
        this._renderCalendarDates(this.year, this.monthCounter);
    }

    _selectDate() {
        this._monthDates.map(item => {
            item.addEventListener("click", (e) => {
                this._selectedDate = new Date(this.year, this.monthCounter, e.target.textContent);
                this._inputField.value = `${this._selectedDate.getDate()}/${this._selectedDate.getMonth()+1}/${this.selectedDate.getFullYear()}`;
                this.close();
            });
        });
    }

    _selectToday(e) {
        e.stopPropagation();
        this._setMonth();

        if (this._now < this._minDate || this._now > this._maxDate) {
            this._renderCalendarDates(this.year, this.month);
            return;
        }

        this._selectedDate = new Date(this.year, this.month, this.currentDay);
        this._renderCalendarDates(this.year, this.month);
        this._inputField.value = `${this.currentDay}/${this.month + 1}/${this.year}`;
    }

    open(e) {
        e.stopPropagation();

        if(!this._selectedDate) {
            this._setMonth();
            this._renderCalendarDates(this.year, this.month);
        }
        else {
            this.monthCounter = this._selectedDate.getMonth();
            this._renderCalendarDates(this._selectedDate.getFullYear(), this._selectedDate.getMonth(), this._selectedDate.getDate());
            this._inputField.value = `${this._selectedDate.getDate()}/${this._selectedDate.getMonth()+1}/${this.selectedDate.getFullYear()}`;
        }

        if(!this._isOpened) {
            this.calendar.classList.remove('calendar_hidden');
            this._isOpened = true;
        }
    }

    close() {
       if (this._isOpened) {
            this.calendar.classList.add('calendar_hidden');
            this._isOpened = false;
       }
    }

    render(input) {
        if(input) {
            this._inputField = input;
            this._inputField.addEventListener("click", this.open.bind(this));
            this._setYear();
            this._setMonth();
            this._setCurrentDay();
            this._renderCalendar();
            this.calendarLabel.addEventListener("click", this._selectToday.bind(this));
            this.nextMonthBtn.addEventListener("click", this._renderNextMonth.bind(this));
            this.previousMonthBtn.addEventListener("click", this._renderPrevMonth.bind(this));
            this.calendar.addEventListener("click", (e) => e.stopPropagation());
            window.addEventListener("click", this.close.bind(this));
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