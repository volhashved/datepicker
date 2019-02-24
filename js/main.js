'use strict';

class Datepicker {
    constructor (minDate, maxDate) {
        this.minDate = minDate;
        this.maxDate = maxDate;        
        this.isDisplayed = false;
        this.now = new Date();   
        this.container = document.querySelector(".container");
        this.weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];        
        this.initCalendar();
    }

    createInputLayout() {
        this.datePicker = document.createElement("div");
        this.datePicker.className = "datepicker";
        this.container.appendChild(this.datePicker);

        this.inputWrap = document.createElement("div");
        this.inputWrap.className = "datepicker__input";
        this.datePicker.appendChild(this.inputWrap);

        this.inputField = document.createElement("input");
        this.inputField.setAttribute("type", "text");
        this.inputWrap.appendChild(this.inputField);        
    }

    createCalendarLayout() {
        this.calendWrap = document.createElement("div");
        this.calendWrap.className = "datepicker__content";
        this.datePicker.appendChild(this.calendWrap);

        this.calendar = document.createElement("div");
        this.calendar.className = "calendar hidden";
        this.calendWrap.appendChild(this.calendar);

        this.calendarLabel = document.createElement("h2");
        this.calendarLabel.className = "calendar__label";
        this.calendar.appendChild(this.calendarLabel);
        this.initHeading();

        this.calendarHeading = document.createElement("div");
        this.calendarHeading.className = "calendar__heading";
        this.calendar.appendChild(this.calendarHeading);

        this.previousMonthBtn = document.createElement("i");
        this.previousMonthBtn.className = "calendar__button_previous fas fa-chevron-left";
        this.calendarHeading.appendChild(this.previousMonthBtn);

        this.activeMonth = document.createElement("h3");
        this.activeMonth.className = "calendar__date_active";
        this.calendarHeading.appendChild(this.activeMonth);

        this.nextMonthBtn = document.createElement("i");
        this.nextMonthBtn.className = "calendar__button_next fas fa-chevron-right";
        this.calendarHeading.appendChild(this.nextMonthBtn);

        this.calendarDates = document.createElement("div");
        this.calendarDates.className = "calendar__days";
        this.calendar.appendChild(this.calendarDates);

        this.weekDays.forEach((item) => {
            let wkDay = document.createElement("div");
            wkDay.textContent = item;
            this.calendarDates.appendChild(wkDay);
        });

        this.calendarTable = document.createElement("div");
        this.calendarTable.className = "calendar__table";
        this.calendar.appendChild(this.calendarTable);

    }

    setYear() {
        this.year = this.now.getFullYear();
        this.yearCounter = this.year;
    }

    setMonth() {
        this.month = this.now.getMonth(); 
        this.monthCounter = this.month;
    }     

    setCurrentDay() {
        this.currentDay = this.now.getDate();
    }

    validateDate() {
        if (this.minDate > this.maxDate) {
            throw new Error("Dates are invalid");
        }
    }

    initHeading() {
        this.calendarLabel.innerHTML = `${this.now.toLocaleString("ru", {        
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'              
        })}`;
    }    

    renderCalendar(yearPar, monthPar) {   
        let year = yearPar;
        let month = monthPar;

        this.activeMonth.innerHTML = `${(new Date(yearPar, monthPar)).toLocaleString("ru", {        
            year: 'numeric',
            month: 'long'                         
        })}`;

        let lastDay = (new Date(year, month + 1, 0)).getDate();        
        
        let stweekDay = (new Date(year, month, 1)).getDay();        
        if (stweekDay == 0) {
            stweekDay = 7;
        }        

        let ltweekday = (new Date(year, month, lastDay)).getDay();

        this.calendarTable.innerHTML = "";

        for(let i = 1; i < stweekDay; i++) {
            let calendarDay = document.createElement("div");
            calendarDay.className = "datepicker__date datepicker__date_disabled";
            calendarDay.innerHTML = " ";
            this.calendarTable.appendChild(calendarDay);
        }            

        for(let i = 1; i <= lastDay; i++) {
            let calendarDay = document.createElement("div");            
            calendarDay.className = "datepicker__date"; 
            let theDate = new Date(yearPar, monthPar, i);

            if(theDate < this.minDate || theDate > this.maxDate) {
                calendarDay.className += " datepicker__date_disabled";
            }

            if(year == this.year && month == this.month && i == this.currentDay) {        
                calendarDay.className += " datepicker__date_today";                
            }
                        
            calendarDay.innerHTML = `${i}`;               
            this.calendarTable.appendChild(calendarDay);
        }
        this.pickDate();  
        
        if (ltweekday == 0) return;
        for(let i = ltweekday; i < 7; i++) {
            let calendarDay = document.createElement("div");
            calendarDay.className = "datepicker__date datepicker__date_disabled";
            calendarDay.innerHTML = "";
            this.calendarTable.appendChild(calendarDay);
        }        
    }

    renderNextMonth() {
        var year = this.year;    
        this.monthCounter = this.monthCounter + 1;
        this.renderCalendar(year, this.monthCounter);          
    }

    renderPrevMonth() {
        var year = this.year;    
        this.monthCounter = this.monthCounter - 1;
        this.renderCalendar(year, this.monthCounter);    
    }

    displayCalendar(e) {
        e.stopPropagation();
        this.renderCalendar(this.year, this.month);      
        if(!this.isDisplayed) {
            this.calendar.classList.remove('hidden');
            this.isDisplayed = true;
        }
    }   

    hideCalendar() {            
       if(this.isDisplayed) {
            this.calendar.classList.add('hidden');
            this.inputField.value = "";
            this.isDisplayed = false;
       }
    }    

    pickDate() {        
        const calendarDates = Array.from(document.getElementsByClassName("datepicker__date"));     
        calendarDates.map(item => {            
            item.addEventListener("click", (e) => this.inputField.value = new Date(this.year, this.monthCounter, e.target.textContent));
        })
    }

    initCalendar() {
        this.validateDate();
        this.setYear();        
        this.setMonth();        
        this.setCurrentDay();    
        this.createInputLayout();
        this. createCalendarLayout();
        this.inputField.addEventListener("click", this.displayCalendar.bind(this));
        this.nextMonthBtn.addEventListener("click", this.renderNextMonth.bind(this));
        this.previousMonthBtn.addEventListener("click", this.renderPrevMonth.bind(this));
        this.calendar.addEventListener("click", (e) => e.stopPropagation());
        window.addEventListener("click", this.hideCalendar.bind(this));
    }    
}

new Datepicker(new Date(2019, 1, 5), new Date(2019, 3, 20));

new Datepicker(new Date(2019, 0, 25), new Date(2019, 2, 11));

new Datepicker(new Date(2019, 1, 10), new Date(2019, 3, 20));