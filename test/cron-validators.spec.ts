import { CronValidators } from '../src';

describe('CronValidators', () => {
  describe('validateExpression()', () => {
    test('should validate a basic 5-field cron expression', () => {
      expect(() =>
        CronValidators.validateExpression('0 9 * * 1-5'),
      ).not.toThrow();
    });

    test('should validate a 6-field cron expression with seconds', () => {
      expect(() =>
        CronValidators.validateExpression('*/30 * * * * *'),
      ).not.toThrow();
    });

    test('should validate lists, ranges, and steps', () => {
      expect(() =>
        CronValidators.validateExpression('0,15,30,45 9-17/2 * 1,6,12 1-5'),
      ).not.toThrow();
    });

    test('should reject an empty expression', () => {
      expect(() => CronValidators.validateExpression('')).toThrow(
        /must not be empty/,
      );
    });

    test('should reject expressions with invalid field counts', () => {
      expect(() => CronValidators.validateExpression('* * * *')).toThrow(
        /expected 5 or 6 fields/,
      );
      expect(() => CronValidators.validateExpression('* * * * * * *')).toThrow(
        /expected 5 or 6 fields/,
      );
    });

    test('should reject field values outside their numeric bounds', () => {
      expect(() => CronValidators.validateExpression('60 * * * *')).toThrow(
        /Invalid minute/,
      );
      expect(() => CronValidators.validateExpression('* 24 * * *')).toThrow(
        /Invalid hour/,
      );
      expect(() => CronValidators.validateExpression('* * 0 * *')).toThrow(
        /Invalid day of month/,
      );
      expect(() => CronValidators.validateExpression('* * * 13 *')).toThrow(
        /Invalid month/,
      );
      expect(() => CronValidators.validateExpression('* * * * 7')).toThrow(
        /Invalid day of week/,
      );
      expect(() => CronValidators.validateExpression('60 * * * * *')).toThrow(
        /Invalid second/,
      );
    });

    test('should reject invalid list syntax', () => {
      expect(() => CronValidators.validateExpression('1,,2 * * * *')).toThrow(
        /Empty list item/,
      );
    });

    test('should reject invalid range syntax', () => {
      expect(() => CronValidators.validateExpression('10-5 * * * *')).toThrow(
        /Range start/,
      );
      expect(() => CronValidators.validateExpression('10- * * * *')).toThrow(
        /Invalid range syntax/,
      );
    });

    test('should reject invalid step syntax', () => {
      expect(() => CronValidators.validateExpression('*/0 * * * *')).toThrow(
        /between 1 and 59/,
      );
      expect(() => CronValidators.validateExpression('*//5 * * * *')).toThrow(
        /Invalid step syntax/,
      );
    });
  });

  describe('isValidExpression()', () => {
    test('should return true for valid expressions', () => {
      expect(CronValidators.isValidExpression('0 0 * * *')).toBe(true);
      expect(CronValidators.isValidExpression('*/5 * * * * *')).toBe(true);
    });

    test('should return false for invalid expressions', () => {
      expect(CronValidators.isValidExpression('')).toBe(false);
      expect(CronValidators.isValidExpression('* * * *')).toBe(false);
      expect(CronValidators.isValidExpression('* * * 13 *')).toBe(false);
    });
  });
});
