class Datepicker {
    constructor (minDate, maxDate) {
        // this.minDate = minDate;
        // this.maxDate = maxDate;        
        this.isDisplayed = false;
        this.now = new Date();

        this.inputField = document.getElementById("datepicker");
        this.calendar = document.getElementsByClassName("datepicker__calendar")[0];
        this.calendarTable = document.getElementsByClassName("datepicker__table")[0];
        this.calendarHeading = document.querySelector("h2");
        this.initCalendar();
    }

    setYear() {
        this.year = this.now.getFullYear()
    }

    setMonth() {
        this.month = this.now.getMonth();       
    }

    setLastDay() {
        const lastDay = new Date(this.year, this.month + 1, 0);
        this.lastDay = lastDay.getDate();
    } 

    setCurrentDay() {
        this.currentDay = this.now.getDate();
    }

    setStartWeekDay() {
        const startDay = new Date(this.year, this.month, 1);
        this.stweekDay = startDay.getDay();
        if (this.weekDay == 0) {
            this.weekDay = 7;
        }      
    }

    setLastWeekDay() {
        const lastDay = new Date(this.year, this.month, this.lastDay);
        this.ltweekDay = lastDay.getDay();        
    }    

    initHeading() {
        this.calendarHeading.innerHTML = `${this.now.toLocaleString("ru", {        
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'              
        })}`;
    }    

    renderCalendar() { 
        this.setYear();        
        this.setMonth(); 
        this.setLastDay();
        this.setCurrentDay();
        this.setStartWeekDay();
        this.setLastWeekDay();             
        this.initHeading();      
        for(let i = 1; i < this.stweekDay; i++) {
            let calendarDay = document.createElement("div");
            calendarDay.className = "datepicker__date_disabled";
            calendarDay.innerHTML = " ";
            this.calendarTable.appendChild(calendarDay);
        }            

        for(let i = 1; i <= this.lastDay; i++) {
            let calendarDay = document.createElement("div");            
            calendarDay.className = "datepicker__date"; 

            if(i < this.currentDay) {
                calendarDay.className += "_disabled";
            }
            else if(i == this.currentDay) {                    
                calendarDay.className += "_today";
            }
                        
            calendarDay.innerHTML = `${i}`;               
            this.calendarTable.appendChild(calendarDay);
        }   
        
        for(let i = this.ltweekDay; i < 7; i++) {
            let calendarDay = document.createElement("div");
            calendarDay.className = "datepicker__date_disabled";
            calendarDay.innerHTML = "";
            this.calendarTable.appendChild(calendarDay);
        }
    }

    displayCalendar(e) {
        e.stopPropagation();
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
        const calendarToday = document.getElementsByClassName("datepicker__date_today")[0];
        calendarDates.forEach(item => {            
            item.addEventListener("click", (e) => this.inputField.value = new Date(this.year, this.month, e.target.textContent));
        });        

        calendarToday.addEventListener("click", (e) => this.inputField.value = new Date(this.year, this.month, e.target.textContent));
        this.calendar.addEventListener("click", (e) => e.stopPropagation());        
    }

    initCalendar() {       
        this.renderCalendar(); 
        this.pickDate();      
        this.inputField.addEventListener("click", this.displayCalendar.bind(this));
        window.addEventListener("click", this.hideCalendar.bind(this));
    }
    
}

const minDate = new Date(2019, 0, 1, 0, 0, 0);
const maxDate = new Date(2019, 0, 31, 0, 0, 0);

let datepicker = new Datepicker(minDate,maxDate);