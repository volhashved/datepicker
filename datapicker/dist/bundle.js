/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./datapicker/src/dp-errors.js":
/*!*************************************!*\
  !*** ./datapicker/src/dp-errors.js ***!
  \*************************************/
/*! exports provided: DateFormatError, DateValueError, InputError */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DateFormatError\", function() { return DateFormatError; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DateValueError\", function() { return DateValueError; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InputError\", function() { return InputError; });\nclass DateFormatError extends Error {\r\n    constructor(message) {\r\n       super(message);\r\n       this.name = \"DateFormatError\";\r\n    }\r\n}\r\n\r\nclass DateValueError extends Error {\r\n    constructor(message) {\r\n       super(message);\r\n       this.name = \"DateValueError\";\r\n    }\r\n}\r\n\r\nclass InputError extends Error {\r\n    constructor(message) {\r\n        super(message);\r\n        this.name = \"InputError\";\r\n    }\r\n}\n\n//# sourceURL=webpack:///./datapicker/src/dp-errors.js?");

/***/ }),

/***/ "./datapicker/src/dp.js":
/*!******************************!*\
  !*** ./datapicker/src/dp.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Datepicker; });\n/* harmony import */ var _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dp-errors.js */ \"./datapicker/src/dp-errors.js\");\n\r\n\r\nclass Datepicker {\r\n    get minDate() {\r\n        return this._minDate;\r\n    }\r\n\r\n    set minDate(minVal) {\r\n        if (minVal instanceof Date) {\r\n            this._minDate = minVal;\r\n        }\r\n        else {\r\n            throw new _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__[\"DateFormatError\"](\"Enter a valid date format\");\r\n        }\r\n    }\r\n\r\n    get maxDate() {\r\n        return this._maxDate;\r\n    }\r\n\r\n    set maxDate(maxVal) {\r\n        if (maxVal instanceof Date) {\r\n            if(maxVal < this._minDate) {\r\n                throw new _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__[\"DateValueError\"](`Min date ${this._setDateFormat(this._minDate)} can not be later than max date ${this._setDateFormat(maxVal)}`);\r\n            }\r\n            this._maxDate = maxVal;\r\n        }\r\n        else {\r\n            throw new _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__[\"DateFormatError\"](\"Enter a valid date format\");\r\n        }\r\n    }\r\n\r\n    get selectedDate() {\r\n        return this._selectedDate;\r\n    }\r\n\r\n    set selectedDate(newDate) {\r\n        if (newDate instanceof Date) {\r\n            if(newDate < this._minDate || newDate > this._maxDate) {\r\n                throw new _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__[\"DateValueError\"](`Selected date ${this._setDateFormat(newDate)} should be between min ${this._setDateFormat(this._minDate)} and max ${this._setDateFormat(this._maxDate)} dates`);\r\n            }\r\n            this._selectedDate = newDate;\r\n        }\r\n        else {\r\n            throw new _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__[\"DateFormatError\"](\"Enter a valid date format\");\r\n        }\r\n    }\r\n\r\n    constructor (\r\n        minDate = new Date(new Date().getFullYear(), 0, 1), \r\n        maxDate = new Date(new Date().getFullYear(), 12, 0)\r\n        ) {\r\n        this.minDate = minDate;\r\n        this.maxDate = maxDate;\r\n        this.init();\r\n    }\r\n\r\n    init() {\r\n        this._now = new Date();\r\n        this._year = null;\r\n        this._month = null;\r\n        this._currentDay = null;\r\n        this._selectedDate = null;\r\n        this._inputField = null;\r\n        this._isOpened = false;\r\n        this._weekDays = [\"Mo\", \"Tu\", \"We\", \"Th\", \"Fr\", \"Sa\", \"Su\"];\r\n        this._monthDates = [];\r\n        this._openRef = this.open.bind(this);\r\n        this._closeRef = this.close.bind(this);\r\n        this._handleKeypressRef = this.handleKeypress.bind(this);\r\n        this._selectTodayRef = this._selectToday.bind(this);\r\n        this._nextMonthRef = this._renderNextMonth.bind(this);\r\n        this._prevMonthRef = this._renderPrevMonth.bind(this);\r\n        this._stopBubblingRef = this._stopBubbling.bind(this);\r\n    }\r\n\r\n    open(e) {\r\n        e.stopPropagation();\r\n\r\n        if(!this._selectedDate) {\r\n            this._setMonth();\r\n            this._renderCalendarDates(this._year, this._month);\r\n        }\r\n        else {\r\n            this._monthCounter = this._selectedDate.getMonth();\r\n            this._renderCalendarDates(this._selectedDate.getFullYear(), this._selectedDate.getMonth(), this._selectedDate.getDate());\r\n            this._inputField.value = `${this._selectedDate.getDate()}/${this._selectedDate.getMonth()+1}/${this._selectedDate.getFullYear()}`;\r\n        }\r\n\r\n        if(!this._isOpened) {\r\n            this._datePicker.classList.remove('datepicker_hidden');\r\n            this._isOpened = true;\r\n        }\r\n    }\r\n\r\n    close() {\r\n       if (this._isOpened) {\r\n            this._datePicker.classList.add('datepicker_hidden');\r\n            this._isOpened = false;\r\n       }\r\n    }\r\n\r\n    destroy() {\r\n        this._inputField.removeEventListener(\"click\", this._openRef);\r\n        this._calendarLabel.removeEventListener(\"click\", this._selectTodayRef);\r\n        this._nextMonthBtn.removeEventListener(\"click\", this._nextMonthRef);\r\n        this._previousMonthBtn.removeEventListener(\"click\", this._prevMonthRef);\r\n        this._calendar.removeEventListener(\"click\", this._stopBubbling);\r\n        window.removeEventListener(\"click\", this._closeRef);\r\n        window.removeEventListener(\"keyup\", this._handleKeypressRef);\r\n        this._datePicker.parentNode.removeChild(this.datePicker);\r\n    }\r\n\r\n    handleKeypress(e) {\r\n        const key = e.which || e.keyCode;\r\n\r\n        switch(key) {\r\n            case 13:\r\n            this.open(e);\r\n            break;\r\n\r\n            case 27:\r\n            this.close();\r\n            break;\r\n\r\n            case 39:\r\n            this._renderNextMonth();\r\n            break;\r\n\r\n            case 37:\r\n            this._renderPrevMonth();\r\n            break;\r\n        }\r\n    }\r\n\r\n    render(input) {\r\n        if(input) {\r\n            this._inputField = input;\r\n            this._inputField.addEventListener(\"click\", this._openRef);\r\n            this._setYear();\r\n            this._setMonth();\r\n            this._setCurrentDay();\r\n            this._renderCalendar();\r\n            this._calendarLabel.addEventListener(\"click\", this._selectTodayRef);\r\n            this._nextMonthBtn.addEventListener(\"click\", this._nextMonthRef);\r\n            this._previousMonthBtn.addEventListener(\"click\", this._prevMonthRef);\r\n            this._calendar.addEventListener(\"click\", this._stopBubbling);\r\n            window.addEventListener(\"click\", this._closeRef);\r\n            window.addEventListener(\"keyup\", this._handleKeypressRef);\r\n        }\r\n        else {\r\n            throw new _dp_errors_js__WEBPACK_IMPORTED_MODULE_0__[\"InputError\"](\"Input is not found\");\r\n        }\r\n    }\r\n\r\n    _setDateFormat(date) {\r\n        return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;\r\n    }\r\n\r\n    _setYear() {\r\n        this._year = this._now.getFullYear();\r\n    }\r\n\r\n    _setMonth() {\r\n        this._month = this._now.getMonth(); \r\n        this._monthCounter = this._month;\r\n    }\r\n\r\n    _setCurrentDay() {\r\n        this._currentDay = this._now.getDate();\r\n    }\r\n\r\n    _renderCalendar() {\r\n        this._datePicker = document.createElement(\"div\");\r\n        this._datePicker.className = \"datepicker datepicker_hidden\";\r\n        this._inputField.parentNode.insertBefore(this._datePicker, this._inputField.nextSibling);\r\n\r\n        this._calendar = document.createElement(\"div\");\r\n        this._calendar.className = \"calendar\";\r\n        this._datePicker.appendChild(this._calendar);\r\n\r\n        this._renderLabel();\r\n        this._renderHeader();\r\n        this._renderCalendarTable();\r\n    }\r\n\r\n    _renderLabel() {\r\n        this._calendarLabel = document.createElement(\"button\");\r\n        this._calendarLabel.className = \"calendar__label\";\r\n        this._calendarLabel.setAttribute(\"title\", \"Today\");\r\n        this._calendar.appendChild(this._calendarLabel);\r\n        this._calendarLabel.innerHTML = `${this._currentDay}/${this._month+1}/${this._year}`;\r\n    }\r\n\r\n    _renderHeader() {\r\n        this._calendarHeader = document.createElement(\"div\");\r\n        this._calendarHeader.className = \"calendar__header\";\r\n        this._calendar.appendChild(this._calendarHeader);\r\n\r\n        this._previousMonthBtn = document.createElement(\"button\");\r\n        this._previousMonthBtn.className = \"calendar__button calendar__button_prev\";\r\n        this._previousMonthBtn.setAttribute(\"title\", \"Previous month\");\r\n        this._calendarHeader.appendChild(this._previousMonthBtn);\r\n\r\n        this._activeMonth = document.createElement(\"div\");\r\n        this._activeMonth.className = \"calendar__month\";\r\n        this._calendarHeader.appendChild(this._activeMonth);\r\n\r\n        this._nextMonthBtn = document.createElement(\"button\");\r\n        this._nextMonthBtn.className = \"calendar__button calendar__button_next\";\r\n        this._nextMonthBtn.setAttribute(\"title\", \"Next month\");\r\n        this._calendarHeader.appendChild(this._nextMonthBtn);\r\n    }\r\n\r\n    _renderCalendarTable() {\r\n        this._calendarDates = document.createElement(\"ul\");\r\n        this._calendarDates.className = \"calendar__days\";\r\n        this._calendar.appendChild(this._calendarDates);\r\n\r\n        this._weekDays.forEach((item) => {\r\n            const wkDay = document.createElement(\"li\");\r\n            wkDay.textContent = item;\r\n            this._calendarDates.appendChild(wkDay);\r\n        });\r\n\r\n        this._calendarTable = document.createElement(\"div\");\r\n        this._calendarTable.className = \"calendar__table\";\r\n        this._calendar.appendChild(this._calendarTable);\r\n    }\r\n\r\n    _renderCalendarDates(yearPar, monthPar) {\r\n        this._activeMonth.innerHTML = `${(new Date(yearPar, monthPar)).toLocaleString(\"en\", {\r\n            year: 'numeric',\r\n            month: 'long'\r\n        })}`;\r\n\r\n        const lastDay = (new Date(yearPar, monthPar + 1, 0)).getDate();\r\n        \r\n        let stweekDay = (new Date(yearPar, monthPar, 1)).getDay();\r\n        if (stweekDay === 0) {\r\n            stweekDay = 7;\r\n        }\r\n\r\n        const ltweekday = (new Date(yearPar, monthPar, lastDay)).getDay();\r\n\r\n        this._calendarTable.innerHTML = \"\";\r\n\r\n        for(let i = 1; i < stweekDay; i++) {\r\n            const calendarDay = document.createElement(\"button\");\r\n            calendarDay.className = \"calendar__date\";\r\n            calendarDay.setAttribute(\"disabled\", \"disabled\");\r\n            calendarDay.innerHTML = \"\";\r\n            this._calendarTable.appendChild(calendarDay);\r\n        }\r\n\r\n        for(let i = 1; i <= lastDay; i++) {\r\n            const calendarDay = document.createElement(\"button\");\r\n            calendarDay.className = \"calendar__date\";\r\n            this._monthDates.push(calendarDay);\r\n            const theDate = new Date(yearPar, monthPar, i);\r\n\r\n            if(theDate < this._minDate || theDate > this._maxDate) {\r\n                calendarDay.setAttribute(\"disabled\", \"disabled\");\r\n            }\r\n\r\n            if(yearPar === this._year && monthPar === this._month && i === this._currentDay) {\r\n                calendarDay.className += \" calendar__date_today\";\r\n            }\r\n\r\n            if(+theDate === +this._selectedDate) {\r\n                calendarDay.className += \" calendar__date_selected\";\r\n            }\r\n\r\n            calendarDay.innerHTML = `${i}`;\r\n            this._calendarTable.appendChild(calendarDay);\r\n        }\r\n        this._selectDate();\r\n\r\n        if (ltweekday === 0) return;\r\n        for(let i = ltweekday; i < 7; i++) {\r\n            const calendarDay = document.createElement(\"button\");\r\n            calendarDay.className = \"calendar__date\";\r\n            calendarDay.setAttribute(\"disabled\", \"disabled\");\r\n            calendarDay.innerHTML = \"\";\r\n            this._calendarTable.appendChild(calendarDay);\r\n        }\r\n    }\r\n\r\n    _renderNextMonth() {\r\n        this._monthCounter = this._monthCounter + 1;\r\n        this._renderCalendarDates(this._year, this._monthCounter);\r\n    }\r\n\r\n    _renderPrevMonth() {\r\n        this._monthCounter = this._monthCounter - 1;\r\n        this._renderCalendarDates(this._year, this._monthCounter);\r\n    }\r\n\r\n    _selectDate() {\r\n        this._monthDates.map(item => {\r\n            item.addEventListener(\"click\", (e) => {\r\n                this._selectedDate = new Date(this._year, this._monthCounter, e.target.textContent);\r\n                this._inputField.value = `${this._setDateFormat(this._selectedDate)}`;\r\n                this.close();\r\n            });\r\n        });\r\n    }\r\n\r\n    _selectToday(e) {\r\n        e.stopPropagation();\r\n        this._setMonth();\r\n\r\n        if (this._now < this._minDate || this._now > this._maxDate) {\r\n            this._renderCalendarDates(this._year, this._month);\r\n            return;\r\n        }\r\n\r\n        this._selectedDate = new Date(this._year, this._month, this._currentDay);\r\n        this._renderCalendarDates(this._year, this._month);\r\n        this._inputField.value = `${this._currentDay}/${this._month + 1}/${this._year}`;\r\n    }\r\n\r\n    _stopBubbling(e) {\r\n        e.stopPropagation();\r\n    }\r\n}\n\n//# sourceURL=webpack:///./datapicker/src/dp.js?");

/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _datapicker_src_dp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../datapicker/src/dp.js */ \"./datapicker/src/dp.js\");\n\r\n\r\n\r\n\r\nconst dp1 = new _datapicker_src_dp_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](new Date(2019, 1, 5), new Date(2020, 3, 20));\r\ndp1.render(document.querySelectorAll(\"input\")[0]);\r\n// dp1.minDate = (new Date(2029, 1, 6));\r\n// dp1.maxDate = (new Date(2019, 3, 22));\r\n// dp1.selectedDate = (new Date(2018, 1, 20));\r\n// dp1.destroy();\r\n\r\nconst dp2 = new _datapicker_src_dp_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](new Date(2017, 0, 25), new Date(2018, 2, 11));\r\ndp2.render(document.querySelectorAll(\"input\")[1]);\n\n//# sourceURL=webpack:///./js/main.js?");

/***/ })

/******/ });