'use strict';

class Datepicker {
    constructor (minDate, maxDate) {
        this.minDate = minDate;
        this.maxDate = maxDate;
        this.isOpened = false;
        this.now = new Date();
        this.container = document.querySelector(".container");
        this.weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
        this.monthDates = [];
        this.initCalendar();
    }

    _setYear() {
        this.year = this.now.getFullYear();
    }

    _setMonth() {
        this.month = this.now.getMonth(); 
        this.monthCounter = this.month;
    }

    _setCurrentDay() {
        this.currentDay = this.now.getDate();
    }

    _validateDate() {
        if (this.minDate > this.maxDate) {
            throw new Error("Dates are invalid");
        }
    }

    _renderInput() {
        this.datePicker = document.createElement("div");
        this.datePicker.className = "datepicker";
        this.container.appendChild(this.datePicker);

        this.inputWrap = document.createElement("div");
        this.inputWrap.className = "datepicker__date";
        this.datePicker.appendChild(this.inputWrap);

        this.inputLabel = document.createElement("label");
        this.inputLabel.className = "datepicker__label";
        this.inputLabel.textContent = "Select date";
        this.inputWrap.appendChild(this.inputLabel);

        this.inputField = document.createElement("input");
        this.inputField.className = "datepicker__input";
        this.inputField.setAttribute("type", "text");
        this.inputLabel.appendChild(this.inputField);
    }

    _renderCalendar() {
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

        this.previousMonthBtn = document.createElement("i");
        this.previousMonthBtn.className = "calendar__button fas fa-chevron-left";
        this.calendarHeader.appendChild(this.previousMonthBtn);

        this.activeMonth = document.createElement("h3");
        this.activeMonth.className = "calendar__month";
        this.calendarHeader.appendChild(this.activeMonth);

        this.nextMonthBtn = document.createElement("i");
        this.nextMonthBtn.className = "calendar__button fas fa-chevron-right";
        this.calendarHeader.appendChild(this.nextMonthBtn);
    }

    _renderCalendarTable() {
        this.calendarDates = document.createElement("ul");
        this.calendarDates.className = "calendar__days";
        this.calendar.appendChild(this.calendarDates);

        this.weekDays.forEach((item) => {
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
            this.monthDates.push(calendarDay);
            const theDate = new Date(yearPar, monthPar, i);

            if(theDate < this.minDate || theDate > this.maxDate) {
                calendarDay.className += " calendar__date_disabled";
            }
            else {
                calendarDay.className += " calendar__date_active";
            }

            if(yearPar === this.year && monthPar === this.month && i === this.currentDay) {
                calendarDay.className += " calendar__date_today";
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
        this.monthDates.map(item => {
            item.addEventListener("click", (e) => {
                this.selectedDate = new Date(this.year, this.monthCounter, e.target.textContent);
                this.inputField.value = `${this.selectedDate.getDate()}/${this.selectedDate.getMonth()+1}/${this.selectedDate.getFullYear()}`;
                this.close();
            });
        });
    }

    _openCurrenMonth(e) {
        e.stopPropagation();
        this._setMonth();
        this._renderCalendarDates(this.year, this.month);
        this.inputField.value = `${this.currentDay}/${this.month + 1}/${this.year}`;
    }

    open(e) {
        e.stopPropagation();
        if(!this.selectedDate) {
            this._renderCalendarDates(this.year, this.month);
        }
        if(!this.isOpened) {
            this.calendar.classList.remove('calendar_hidden');
            this.isOpened = true;
        }
    }

    close() {
       if (this.isOpened) {
            this.calendar.classList.add('calendar_hidden');
            this.isOpened = false;
       }
    }

    initCalendar() {
        this._validateDate();
        this._setYear();
        this._setMonth();
        this._setCurrentDay();
        this._renderInput();
        this._renderCalendar();
        this.inputField.addEventListener("click", this.open.bind(this));
        this.calendarLabel.addEventListener("click", this._openCurrenMonth.bind(this));
        this.nextMonthBtn.addEventListener("click", this._renderNextMonth.bind(this));
        this.previousMonthBtn.addEventListener("click", this._renderPrevMonth.bind(this));
        this.calendar.addEventListener("click", (e) => e.stopPropagation());
        window.addEventListener("click", this.close.bind(this));
    }
}

new Datepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
new Datepicker(new Date(2017, 0, 25), new Date(2018, 2, 11));
new Datepicker(new Date(2019, 1, 10), new Date(2019, 3, 20));