class Datepicker {
    constructor (minDate, maxDate) {
        // this.minDate = minDate;
        // this.maxDate = maxDate;        
        this.isDisplayed = false;
        this.now = new Date();        

        this.inputField = document.getElementById("datepicker");
        this.calendar = document.querySelector(".calendar");
        this.calendarTable = document.querySelector(".calendar__table");
        this.calendarHeading = document.querySelector(".calendar__date_today");
        this.activeMonth = document.querySelector(".calendar__date_active");
        this.nextMonthBtn = document.querySelector(".calendar__button_next");
        this.previousMonthBtn = document.querySelector(".calendar__button_previous");
        this.initCalendar();
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

    initHeading() {
        this.calendarHeading.innerHTML = `${this.now.toLocaleString("ru", {        
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

            if(year == this.year && month == this.month) {
                if(i < this.currentDay) {
                    calendarDay.className += " datepicker__date_disabled";
                }
                else if(i == this.currentDay) {                    
                    calendarDay.className += " datepicker__date_today";
                }
            }

            if(year < this.year || month < this.month) {
                calendarDay.className += " datepicker__date_disabled";
            }
                        
            calendarDay.innerHTML = `${i}`;               
            this.calendarTable.appendChild(calendarDay);
        }   
        
        if (ltweekday == 0) return;
        for(let i = ltweekday; i < 7; i++) {
            let calendarDay = document.createElement("div");
            calendarDay.className = "datepicker__date_disabled";
            calendarDay.innerHTML = "";
            this.calendarTable.appendChild(calendarDay);
        }
    }

    renderNextMonth() {
        var year = this.year;    
        this.monthCounter = this.monthCounter + 1;
        this.renderCalendar(year, this.monthCounter); 
        this.pickDate();
          
    }

    renderPrevMonth() {
        var year = this.year;    
        this.monthCounter = this.monthCounter - 1;
        this.renderCalendar(year, this.monthCounter);   
        this.pickDate();   
    }

    displayCalendar(e) {
        e.stopPropagation();
        this.renderCalendar(this.year, this.month);
        this.pickDate();
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
        const calendarDates = Array.from(document.getElementsByClassName("datepicker__date"))
        calendarDates.forEach(item => {            
            item.addEventListener("click", (e) => this.inputField.value = new Date(this.year, this.monthCounter, e.target.textContent));
        });       
        
        this.calendar.addEventListener("click", (e) => e.stopPropagation());        
    }

    initCalendar() {  
        this.setYear();        
        this.setMonth();        
        this.setCurrentDay();        
        this.initHeading();              
        this.inputField.addEventListener("click", this.displayCalendar.bind(this));
        this.nextMonthBtn.addEventListener("click", this.renderNextMonth.bind(this));
        this.previousMonthBtn.addEventListener("click", this.renderPrevMonth.bind(this));
        window.addEventListener("click", this.hideCalendar.bind(this));
    }
    
}

const minDate = new Date(2019, 0, 1, 0, 0, 0);
const maxDate = new Date(2019, 0, 31, 0, 0, 0);

let datepicker = new Datepicker(minDate,maxDate);