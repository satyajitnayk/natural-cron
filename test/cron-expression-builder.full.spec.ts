import { CronExpressionBuilder } from '../src';
import { CronTimeUnit } from '../src/interfaces';

describe('CronExpressionBuilder - FULL', () => {
  let schedule: CronExpressionBuilder;

  beforeEach(() => {
    schedule = new CronExpressionBuilder();
  });

  test('Run a job at 5:30 PM every day', () => {
    expect(schedule.atTime('17:30').compile()).toStrictEqual(`30 17 * * *`);
  });

  test('Run at 9 AM on weekdays', () => {
    expect(
      schedule.atTime('09:00').onWeekDays([1, 2, 3, 4, 5]).compile(),
    ).toStrictEqual(`0 9 * * 1-5`);
  });

  test('Run at noon on the 1st and 15th of the month', () => {
    expect(
      schedule.atTime('12:00').onDaysOfMonth([1, 15]).compile(),
    ).toStrictEqual(`0 12 1,15 * *`);
  });

  test('Run at midnight during January and July', () => {
    expect(
      schedule.atTime('00:00').duringMonths([1, 7]).compile(),
    ).toStrictEqual(`0 0 * 1,7 *`);
  });

  test('Run every 15 minutes', () => {
    expect(schedule.everyX(15, CronTimeUnit.Minute).compile()).toStrictEqual(
      `*/15 * * * *`,
    );
  });

  test('Run every day at noon', () => {
    expect(schedule.every('day').atHours([12]).compile()).toStrictEqual(
      `0 12 * * *`,
    );
  });

  test('Run every Sunday at 5 PM', () => {
    expect(schedule.onWeekDays([0]).atHours([17]).compile()).toStrictEqual(
      `0 17 * * 0`,
    );
  });

  test('Run the 1st day of every month at 1 AM', () => {
    expect(
      schedule.onDaysOfMonth([1]).every('month').atHours([1]).compile(),
    ).toStrictEqual(`0 1 1 * *`);
  });

  test('Run every weekday at 8:30 AM', () => {
    expect(
      schedule.atTime('08:30').onWeekDays([1, 2, 3, 4, 5]).compile(),
    ).toStrictEqual(`30 8 * * 1-5`);
  });

  test('Run every 6 hours', () => {
    expect(schedule.everyX(6, CronTimeUnit.Hour).compile()).toStrictEqual(
      `0 */6 * * *`,
    );
  });

  test('Run every quarter at midnight', () => {
    expect(
      schedule
        .duringMonths([1, 4, 7, 10])
        .onDaysOfMonth([1])
        .atTime('00:00')
        .compile(),
    ).toStrictEqual(`0 0 1 1,4,7,10 *`);
  });

  test('Run every Saturday and Sunday at 10:15 AM', () => {
    expect(schedule.atTime('10:15').onWeekDays([6, 0]).compile()).toStrictEqual(
      `15 10 * * 0,6`,
    );
  });

  test('Run at 9 AM, 12 PM, and 3 PM every day', () => {
    expect(schedule.every('day').atHours([9, 12, 15]).compile()).toStrictEqual(
      `0 9,12,15 * * *`,
    );
  });

  test('Run at 7 AM, 2 PM, and 10 PM on Tuesdays', () => {
    expect(
      schedule.atHours([7, 14, 22]).onWeekDays([2]).compile(),
    ).toStrictEqual(`0 7,14,22 * * 2`);
  });

  test('Run at 20 past every hour on the 5th of July', () => {
    expect(
      schedule.atMinutes([20]).onDaysOfMonth([5]).duringMonths([7]).compile(),
    ).toStrictEqual(`20 * 5 7 *`);
  });

  test('Run every 5 minutes during office hours - using every()', () => {
    expect(
      schedule
        .every('minute')
        .atMinutes([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
        .atHours([9, 10, 11, 12, 13, 14, 15, 16])
        .compile(),
    ).toStrictEqual(`0,5,10,15,20,25,30,35,40,45,50,55 9-16 * * *`);
  });

  test('Run every 5 minutes during office hours - using everyX()', () => {
    expect(
      schedule
        .everyX(5, CronTimeUnit.Minute)
        .atHours([9, 10, 11, 12, 13, 14, 15, 16])
        .compile(),
    ).toStrictEqual(`*/5 9-16 * * *`);
  });

  test('Run at quarter past and quarter to every hour', () => {
    expect(schedule.every('hour').atMinutes([15, 45]).compile()).toStrictEqual(
      `15,45 * * * *`,
    );
  });
});
