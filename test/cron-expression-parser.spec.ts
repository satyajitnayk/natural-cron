import { CronExpressionParser } from '../src';

describe('CronExpressionParser', () => {
  describe('parse()', () => {
    test('should parse a valid 5-field cron expression', () => {
      expect(CronExpressionParser.parse('0 9 * * 1-5')).toStrictEqual({
        minute: '0',
        hour: '9',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '1-5',
      });
    });

    test('should parse a valid 6-field cron expression with seconds', () => {
      expect(CronExpressionParser.parse('*/30 * * * * *')).toStrictEqual({
        second: '*/30',
        minute: '*',
        hour: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*',
      });
    });

    test('should normalize leading, trailing, and repeated whitespace', () => {
      expect(
        CronExpressionParser.parse('  15   10  *  *   1,5  '),
      ).toStrictEqual({
        minute: '15',
        hour: '10',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '1,5',
      });
    });

    test('should preserve cron field syntax in parsed fields', () => {
      expect(
        CronExpressionParser.parse('0,15,30,45 9-17/2 * 1,6,12 1-5'),
      ).toStrictEqual({
        minute: '0,15,30,45',
        hour: '9-17/2',
        dayOfMonth: '*',
        month: '1,6,12',
        dayOfWeek: '1-5',
      });
    });

    test('should throw for invalid cron expressions', () => {
      expect(() => CronExpressionParser.parse('* * * *')).toThrow(
        /expected 5 or 6 fields/,
      );
      expect(() => CronExpressionParser.parse('60 * * * *')).toThrow(
        /Invalid minute/,
      );
    });
  });
});
