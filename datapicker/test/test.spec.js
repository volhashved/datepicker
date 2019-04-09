import Datepicker from '../src/dp.js';

describe("Test Datepicker", function() { 
  let dp;

  beforeEach(function() {
    dp = new Datepicker();
  });

  it("should exist", function() {
    expect(dp).toBeDefined();
  });

  it("should have a default min date", function() {
    expect(dp.minDate).toEqual(dp._minDate);
  });

  it("should have a defined min date", function() {
    const dp = new Datepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
    expect(dp.minDate).toEqual(new Date(2019, 1, 5));
  });

  it("should have a default max date", function() {
    expect(dp.maxDate).toEqual(dp._maxDate);
  });

  it("should have a defined max date", function() {
    const dp = new Datepicker(new Date(2019, 1, 5), new Date(2020, 3, 20));
    expect(dp.maxDate).toEqual(new Date(2020, 3, 20));
  });

  it("should set a correct date format", function() {
    const dateSring = dp._setDateFormat(new Date(2019, 1, 5));
    expect(dateSring).toBe("5/2/2019");
  });

  it("should render calendar", function() {
    const input = document.createElement('input');
    document.body.appendChild(input);
    dp.render(input);
    expect(dp._isRendered).toBeTruthy();
  });

  it("should show error if an argument is not input", function() {
    expect(function(){ dp.render(); }).toThrowError();
    expect(function(){ dp.render("string"); }).toThrowError();
    expect(function(){ dp.render(10); }).toThrowError();
  });

  it("should close calendar", function() {
    dp.close();

    const dpClosed = dp._isOpened == false ? true : false;
    expect(dpClosed).toBeTruthy();
  });

  it("should open calendar", function() {
    const input = document.createElement('input');
    document.body.appendChild(input);
    dp.render(input);
    dp.open();

    expect(dp._isOpened).toBe(true);
  });
});