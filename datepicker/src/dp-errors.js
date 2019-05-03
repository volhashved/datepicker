export class DateFormatError extends Error {
    constructor(message) {
       super(message);
       this.name = "DateFormatError";
    }
}

export class DateValueError extends Error {
    constructor(message) {
       super(message);
       this.name = "DateValueError";
    }
}

export class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputError";
    }
}

export class RenderError extends Error {
    constructor(message) {
        super(message);
        this.name = "RenderError";
    }
}