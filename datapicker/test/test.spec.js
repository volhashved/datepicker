import Datepicker from '../src/dp.js';

describe("Test Datepicker", function() { 
  const dp = new Datepicker();
  
  it("should exist", function() {
    expect(typeof dp).toBe('object');
    expect(dp instanceof Datepicker).toBe(true);
  });

  it("should have min date", function() {
    const dp1 = new Datepicker();
    expect(dp1.minDate).toEqual(dp1._minDate);

    const dp2 = new Datepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
    expect(dp2.minDate).toEqual(new Date(2019, 1, 5));
  });

  it("should have max date", function() {
    const dp1 = new Datepicker();
    expect(dp1.maxDate).toEqual(dp1._maxDate);

    const dp2 = new Datepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
    expect(dp2.maxDate).toEqual(new Date(2020, 3, 20));
  });

  it("should set a correct date format", function() {
    const dateSring = dp._setDateFormat(new Date(2019, 1, 5));
    expect(dateSring).toBe("5/2/2019");
  });

  it("should render calendar", function() {
    expect(function(){ dp.render(); }).toThrow(new Error("There is no valid input"));
    expect(function(){ dp.render("string"); }).toThrow(new Error("Element string is not an input"));
    expect(function(){ dp.render(10); }).toThrow(new Error("Element 10 is not an input"));
  });

  it("should close", function() {
    const dp = new Datepicker();
    dp.close();

    const dpClosed = dp._isOpened == false ? true : false;
    // const dpClosed = dp._datePicker.classList.contains('datepicker_hidden') ? true : false;
    expect(dpClosed).toBe(true);
  });
});