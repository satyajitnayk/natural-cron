import { CronExpressionDescriber, describeCron } from '../src';

describe('CronExpressionDescriber', () => {
  describe('describe()', () => {
    test('should describe every second expressions', () => {
      expect(CronExpressionDescriber.describe('* * * * * *')).toBe(
        'Every second',
      );
      expect(CronExpressionDescriber.describe('*/30 * * * * *')).toBe(
        'Every 30 seconds',
      );
    });

    test('should describe every minute expressions', () => {
      expect(CronExpressionDescriber.describe('* * * * *')).toBe(
        'Every minute',
      );
    });

    test('should describe interval expressions', () => {
      expect(CronExpressionDescriber.describe('*/15 * * * *')).toBe(
        'Every 15 minutes',
      );
      expect(CronExpressionDescriber.describe('0 */6 * * *')).toBe(
        'Every 6 hours',
      );
      expect(CronExpressionDescriber.describe('0 */5 * * * *')).toBe(
        'Every 5 minutes',
      );
    });

    test('should describe daily fixed-time expressions', () => {
      expect(CronExpressionDescriber.describe('30 17 * * *')).toBe(
        'At 17:30 every day',
      );
    });

    test('should describe weekday and weekend expressions', () => {
      expect(CronExpressionDescriber.describe('0 9 * * 1-5')).toBe(
        'At 09:00, Monday through Friday',
      );
      expect(CronExpressionDescriber.describe('15 10 * * 6,0')).toBe(
        'At 10:15, on weekends',
      );
    });

    test('should describe fixed-time expressions on specific weekdays', () => {
      expect(CronExpressionDescriber.describe('0 17 * * 0')).toBe(
        'At 17:00, on Sunday',
      );
      expect(CronExpressionDescriber.describe('0 7 * * 2,4')).toBe(
        'At 07:00, on Tuesday and Thursday',
      );
    });

    test('should describe fixed-time expressions on days of month', () => {
      expect(CronExpressionDescriber.describe('0 12 1,15 * *')).toBe(
        'At 12:00, on day 1 and 15 of the month',
      );
    });

    test('should describe fixed-time expressions during specific months', () => {
      expect(CronExpressionDescriber.describe('0 0 * 1,7 *')).toBe(
        'At 00:00, in January and July',
      );
      expect(CronExpressionDescriber.describe('0 0 1 1,4,7,10 *')).toBe(
        'At 00:00, on day 1 of the month in January, April, July and October',
      );
    });

    test('should return a fallback for valid but unsupported expressions', () => {
      expect(CronExpressionDescriber.describe('15,45 * * * *')).toBe(
        'Custom schedule: 15,45 * * * *',
      );
    });

    test('should throw for invalid cron expressions', () => {
      expect(() => CronExpressionDescriber.describe('* * * *')).toThrow(
        /expected 5 or 6 fields/,
      );
    });
  });
});

describe('describeCron()', () => {
  test('should describe cron expressions through the helper function', () => {
    expect(describeCron('0 9 * * 1-5')).toBe('At 09:00, Monday through Friday');
  });
});
