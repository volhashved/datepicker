import { Datepicker } from '../src/dp.js';

describe("A suite is just a function", function() {
    function sayHi(name,age) {
      return `Hello ${name}, ${age}`
    }
  
    it("should say Hello", function() {
      var a = sayHi('Olga', 28)
  
      expect(a).toBe(`Hello Olga, 28`);
    });
  });