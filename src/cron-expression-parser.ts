import type {
  ParsedCronExpression,
  ParsedCronExpressionWithSeconds,
  ParsedCronSchedule,
} from './interfaces';
import { CronValidators } from './cron-validators';

/**
 * Class to parse cron expressions into named schedule fields.
 */
export class CronExpressionParser {
  /**
   * Parses a valid 5-field or 6-field cron expression into named fields.
   * @param {string} expression - The cron expression to parse.
   * @returns {ParsedCronSchedule} The parsed cron expression fields.
   */
  static parse(expression: string): ParsedCronSchedule {
    CronValidators.validateExpression(expression);

    const parts = expression.trim().split(/\s+/);

    if (parts.length === 6) {
      return CronExpressionParser.parseWithSeconds(parts);
    }

    return CronExpressionParser.parseWithoutSeconds(parts);
  }

  private static parseWithoutSeconds(parts: string[]): ParsedCronExpression {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    return {
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
    };
  }

  private static parseWithSeconds(
    parts: string[],
  ): ParsedCronExpressionWithSeconds {
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    return {
      second,
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek,
    };
  }
}
