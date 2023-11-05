import { CronExpressionBuilder } from '../src';
import { CronTimeUnit } from '../src/interfaces';

describe('CronExpressionBuilder', () => {
  let schedule: CronExpressionBuilder;

  beforeEach(() => {
    schedule = new CronExpressionBuilder();
  });

  describe('atMinutes()', () => {
    test('should set the minute when a valid minute is provided', () => {
      expect(schedule.atMinutes([30]).compile()).toStrictEqual('30 * * * *');
    });

    test('should accept 0 as the first valid minute for cron', () => {
      expect(schedule.atMinutes([0]).compile()).toStrictEqual('0 * * * *');
    });

    test('should accept 59 as the last valid minute for cron', () => {
      expect(schedule.atMinutes([59]).compile()).toStrictEqual('59 * * * *');
    });

    test('should throw an error when the minute is less than 0', () => {
      expect(() => schedule.atMinutes([-1])).toThrow(/Invalid minute/);
    });

    test('should throw an error when the minute is greater than 59', () => {
      expect(() => schedule.atMinutes([60])).toThrow(/Invalid minute/);
    });
  });

  describe('atHours()', () => {
    test('should set the hour when a valid hour is provided', () => {
      expect(schedule.atHours([12]).compile()).toStrictEqual('0 12 * * *');
    });

    test('should accept 0 as the first valid hour for cron', () => {
      expect(schedule.atHours([0]).compile()).toStrictEqual('0 0 * * *');
    });

    test('should accept 23 as the last valid hour for cron', () => {
      expect(schedule.atHours([23]).compile()).toStrictEqual('0 23 * * *');
    });

    test('should throw an error when the hour is less than 0', () => {
      expect(() => schedule.atHours([-1])).toThrow(/Invalid hour/);
    });

    test('should throw an error when the hour is greater than 23', () => {
      expect(() => schedule.atHours([24])).toThrow(/Invalid hour/);
    });

    test('should throw an error for non-integer hour values', () => {
      expect(() => schedule.atHours([12.5])).toThrow(/Invalid hour/);
    });
  });

  describe('every()', () => {
    test('should set the schedule for every minute correctly', () => {
      expect(schedule.every('minute').compile()).toBe('* * * * *');
    });

    test('should set the schedule for every hour correctly', () => {
      expect(schedule.every('hour').compile()).toBe('0 * * * *');
    });

    test('should set the schedule for every day correctly', () => {
      expect(schedule.every('day').compile()).toBe('0 0 * * *');
    });

    test('should set the schedule for every month correctly', () => {
      expect(schedule.every('month').compile()).toBe('0 0 1 * *');
    });

    test('should set the schedule for every week correctly', () => {
      expect(schedule.every('week').compile()).toBe('0 0 * * 0');
    });

    test('should throw an error when an invalid unit is provided', () => {
      expect(() => schedule.every('decade')).toThrow(
        /Invalid time unit for cron: decade/,
      );
    });
  });

  describe('atTime()', () => {
    test('should set the correct time when a valid time is provided', () => {
      expect(schedule.atTime('14:30').compile()).toBe(`30 14 * * *`);
    });

    test('should set the correct time for midnight', () => {
      expect(schedule.atTime('00:00').compile()).toBe('0 0 * * *');
    });

    test('should set the correct time for noon', () => {
      expect(schedule.atTime('12:00').compile()).toBe('0 12 * * *');
    });

    test('should throw an error for an invalid hour', () => {
      expect(() => schedule.atTime('25:00')).toThrow(/Invalid time format/);
    });

    test('should throw an error for an invalid minute', () => {
      expect(() => schedule.atTime('23:60')).toThrow(/Invalid time format/);
    });

    test('should handle times without leading zero', () => {
      expect(schedule.atTime('7:5').compile()).toBe('5 7 * * *');
    });

    describe('should throw an error for an invalid time format', () => {
      test('1', () => {
        expect(() => schedule.atTime('14:30:10')).toThrow(
          /Invalid time format/,
        );
      });

      test('2', () => {
        const invalidTime = '25:61';
        expect(() => schedule.atTime(invalidTime)).toThrow(
          /Invalid time format/,
        );
      });
    });

    test('should overwrite existing time values', () => {
      expect(schedule.atTime('10:00').atTime('14:30').compile()).toBe(
        '30 14 * * *',
      );
    });
  });

  describe('onWeekDays()', () => {
    test('should set a single day of the week', () => {
      expect(schedule.onWeekDays([3]).compile()).toStrictEqual('* * * * 3');
    });

    test('should set multiple days of the week', () => {
      // Monday and Friday
      expect(schedule.onWeekDays([1, 5]).compile()).toStrictEqual(
        '* * * * 1,5',
      );
    });

    test('should reject array with invalid days', () => {
      expect(() => schedule.onWeekDays([1, 8])).toThrow(/Invalid day of week/);
    });

    test('should reject array with negative days', () => {
      expect(() => schedule.onWeekDays([1, -3])).toThrow(/Invalid day of week/);
    });

    test('should reject invalid day numbers', () => {
      expect(() => schedule.onWeekDays([8])).toThrow(/Invalid day of week/);
    });

    test('should reject negative day numbers', () => {
      expect(() => schedule.onWeekDays([-1])).toThrow(/Invalid day of week/);
    });
  });

  describe('onDaysOfMonth()', () => {
    test('should set a single day of the month', () => {
      expect(schedule.onDaysOfMonth([15]).compile()).toStrictEqual(
        '* * 15 * *',
      );
    });

    test('should set multiple days of the month', () => {
      expect(schedule.onDaysOfMonth([1, 10, 20]).compile()).toStrictEqual(
        '* * 1,10,20 * *',
      );
    });

    test('should throw an error for invalid day of the month', () => {
      expect(() => schedule.onDaysOfMonth([32])).toThrow(
        /Invalid day of month/,
      );
    });

    test('should not allow days less than 1', () => {
      expect(() => schedule.onDaysOfMonth([0])).toThrow(/Invalid day of month/);
    });

    test('should not allow days greater than 31', () => {
      expect(() => schedule.onDaysOfMonth([32])).toThrow(
        /Invalid day of month/,
      );
    });
  });

  describe('duringMonths()', () => {
    test('should set a single month', () => {
      // June
      expect(schedule.duringMonths([6]).compile()).toStrictEqual('* * * 6 *');
    });

    test('should set multiple months', () => {
      // February, April, June
      expect(schedule.duringMonths([2, 4, 6]).compile()).toStrictEqual(
        '* * * 2,4,6 *',
      );
    });

    test('should throw an error for invalid month numbers', () => {
      expect(() => schedule.duringMonths([0])).toThrow(/Invalid month/);
      expect(() => schedule.duringMonths([13])).toThrow(/Invalid month/);
    });
  });

  describe('everyX()', () => {
    test('every 15 minutes', () => {
      expect(schedule.everyX(15, CronTimeUnit.Minute).compile()).toStrictEqual(
        '*/15 * * * *',
      );
    });

    test('for every 3 hours', () => {
      expect(schedule.everyX(3, CronTimeUnit.Hour).compile()).toStrictEqual(
        '0 */3 * * *',
      );
    });

    test('every 5 days of the month', () => {
      expect(
        schedule.everyX(5, CronTimeUnit.DayOfMonth).compile(),
      ).toStrictEqual('0 0 */5 * *');
    });

    test('every 2 months', () => {
      expect(schedule.everyX(2, CronTimeUnit.Month).compile()).toStrictEqual(
        '0 0 1 */2 *',
      );
    });
  });
});
