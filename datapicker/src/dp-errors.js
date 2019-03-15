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