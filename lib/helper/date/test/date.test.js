'use strict';

const dateHelper = require('../index');

describe('Date helper suite', function() {
  test('Date helper daysAgo returns a valid date', function() {
    const date = dateHelper.daysAgo(1);
    expect(isNaN(date)).toBe(false);
  });

  test('Date helper isBefore returns TRUE if the first date is before the second one', function() {
    const date1 = new Date('2018-11-01T14:50:00+00:00');
    const date2 = new Date('2018-11-03T14:50:00+00:00');

    expect(dateHelper.isBefore(date1, date2)).toBe(true);
    expect(dateHelper.isBefore(date2, date1)).toBe(false);
  });

  test('Date helper isAfter returns TRUE if the first date is after the second one', function() {
    const date1 = new Date('2018-11-03T14:50:00+00:00');
    const date2 = new Date('2018-11-01T14:50:00+00:00');

    expect(dateHelper.isAfter(date1, date2)).toBe(true);
    expect(dateHelper.isAfter(date2, date1)).toBe(false);
  });

  test('Date helper secondsToHour converts the given amount to hours', function() {
    expect(dateHelper.secondsToHour(3600)).toBe(1);
    expect(dateHelper.secondsToHour(0)).toBe(0);
  });

  test('Date helper fromTime returns a date object from the given date with the given hour', function() {
    expect(dateHelper.fromTime(5).getHours()).toBe(5);
  });

  test('Date helper isWeekend checks if the given date is Sunday or Saturday', function() {
    const sunday = new Date('2018-11-04T14:50:00+00:00');
    const saturday = new Date('2018-11-03T14:50:00+00:00');
    const monday = new Date('2018-11-02T14:50:00+00:00');

    expect(dateHelper.isWeekend(sunday)).toBe(true);
    expect(dateHelper.isWeekend(saturday)).toBe(true);
    expect(dateHelper.isWeekend(monday)).toBe(false);
  });

  test('Date helper formatWithDay formats the given date to include the day', function() {
    const sunday = new Date('2018-11-04T14:50:00+00:00');
    expect(dateHelper.formatWithDay(sunday).includes('Sunday')).toBe(true);
  });

  test('Date helper format returns the date in dd/mm/yyyy format', function() {
    const date = new Date('2018-11-04T14:50:00+00:00');
    expect(dateHelper.format(date)).toBe('4/11/2018');
  });

  test('Date helper format12hour returns the date in hh:mm a format', function() {
    const date = new Date('2018-11-04T14:50:00+00:00');
    expect(dateHelper.format12hour(date)).toBe('09:50 AM');
  });

});
