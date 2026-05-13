import { CronExpressionParser } from './cron-expression-parser';
import type { ParsedCronExpression, ParsedCronSchedule } from './interfaces';

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Class to describe cron expressions in human-readable language.
 */
export class CronExpressionDescriber {
  /**
   * Describes a valid 5-field or 6-field cron expression.
   * @param {string} expression - The cron expression to describe.
   * @returns {string} A human-readable description of the cron expression.
   */
  static describe(expression: string): string {
    const normalizedExpression = expression.trim().split(/\s+/).join(' ');
    const parsedExpression = CronExpressionParser.parse(expression);
    const description =
      CronExpressionDescriber.describeParsed(parsedExpression);

    return description ?? `Custom schedule: ${normalizedExpression}`;
  }

  private static describeParsed(
    parsedExpression: ParsedCronSchedule,
  ): string | undefined {
    if ('second' in parsedExpression) {
      return CronExpressionDescriber.describeWithSeconds(parsedExpression);
    }

    return CronExpressionDescriber.describeWithoutSeconds(parsedExpression);
  }

  private static describeWithSeconds(
    parsedExpression: ParsedCronSchedule & { second: string },
  ): string | undefined {
    const { second, minute, hour, dayOfMonth, month, dayOfWeek } =
      parsedExpression;

    if (
      second === '*' &&
      minute === '*' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return 'Every second';
    }

    const secondInterval = CronExpressionDescriber.getStepInterval(second);
    if (
      secondInterval !== undefined &&
      minute === '*' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return `Every ${secondInterval} seconds`;
    }

    if (second === '0') {
      return CronExpressionDescriber.describeWithoutSeconds({
        minute,
        hour,
        dayOfMonth,
        month,
        dayOfWeek,
      });
    }

    return undefined;
  }

  private static describeWithoutSeconds(
    parsedExpression: ParsedCronExpression,
  ): string | undefined {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = parsedExpression;

    if (
      minute === '*' &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return 'Every minute';
    }

    const minuteInterval = CronExpressionDescriber.getStepInterval(minute);
    if (
      minuteInterval !== undefined &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return `Every ${minuteInterval} minutes`;
    }

    const hourInterval = CronExpressionDescriber.getStepInterval(hour);
    if (
      minute === '0' &&
      hourInterval !== undefined &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return `Every ${hourInterval} hours`;
    }

    const time = CronExpressionDescriber.formatTime(hour, minute);
    if (time === undefined) {
      return undefined;
    }

    const scheduleParts = CronExpressionDescriber.describeDateParts(
      dayOfMonth,
      month,
      dayOfWeek,
    );

    return scheduleParts === undefined
      ? `At ${time} every day`
      : `At ${time}, ${scheduleParts}`;
  }

  private static describeDateParts(
    dayOfMonth: string,
    month: string,
    dayOfWeek: string,
  ): string | undefined {
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return undefined;
    }

    if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
      return CronExpressionDescriber.describeDayOfWeek(dayOfWeek);
    }

    if (dayOfWeek !== '*') {
      return undefined;
    }

    const dayDescription =
      dayOfMonth === '*'
        ? undefined
        : CronExpressionDescriber.describeDayOfMonth(dayOfMonth);
    const monthDescription =
      month === '*' ? undefined : CronExpressionDescriber.describeMonth(month);

    if (dayDescription !== undefined && monthDescription !== undefined) {
      return `${dayDescription} ${monthDescription}`;
    }

    return dayDescription ?? monthDescription;
  }

  private static describeDayOfWeek(dayOfWeek: string): string | undefined {
    if (dayOfWeek === '1-5') {
      return 'Monday through Friday';
    }

    if (dayOfWeek === '0,6' || dayOfWeek === '6,0') {
      return 'on weekends';
    }

    const rangeDescription = CronExpressionDescriber.describeNumberRange(
      dayOfWeek,
      WEEKDAY_NAMES,
    );
    if (rangeDescription !== undefined) {
      return rangeDescription;
    }

    const listDescription = CronExpressionDescriber.describeNumberList(
      dayOfWeek,
      WEEKDAY_NAMES,
    );
    return listDescription === undefined ? undefined : `on ${listDescription}`;
  }

  private static describeDayOfMonth(dayOfMonth: string): string | undefined {
    const days = CronExpressionDescriber.parseNumberList(dayOfMonth);

    if (days === undefined) {
      return undefined;
    }

    return `on day ${CronExpressionDescriber.joinWords(
      days.map((day) => day.toString()),
    )} of the month`;
  }

  private static describeMonth(month: string): string | undefined {
    const monthDescription = CronExpressionDescriber.describeNumberList(
      month,
      MONTH_NAMES,
      1,
    );

    return monthDescription === undefined
      ? undefined
      : `in ${monthDescription}`;
  }

  private static describeNumberRange(
    value: string,
    labels: string[],
    offset = 0,
  ): string | undefined {
    const match = value.match(/^(\d+)-(\d+)$/);

    if (match === null) {
      return undefined;
    }

    const start = Number(match[1]);
    const end = Number(match[2]);
    const startLabel = labels[start - offset];
    const endLabel = labels[end - offset];

    if (startLabel === undefined || endLabel === undefined) {
      return undefined;
    }

    return `${startLabel} through ${endLabel}`;
  }

  private static describeNumberList(
    value: string,
    labels: string[],
    offset = 0,
  ): string | undefined {
    const values = CronExpressionDescriber.parseNumberList(value);

    if (values === undefined) {
      return undefined;
    }

    const words = values.map((item) => labels[item - offset]);

    if (words.some((word) => word === undefined)) {
      return undefined;
    }

    return CronExpressionDescriber.joinWords(words);
  }

  private static parseNumberList(value: string): number[] | undefined {
    const values = value.split(',');

    if (values.some((item) => !/^\d+$/.test(item))) {
      return undefined;
    }

    return values.map((item) => Number(item));
  }

  private static getStepInterval(value: string): number | undefined {
    const match = value.match(/^\*\/(\d+)$/);

    return match === null ? undefined : Number(match[1]);
  }

  private static formatTime(hour: string, minute: string): string | undefined {
    if (!/^\d+$/.test(hour) || !/^\d+$/.test(minute)) {
      return undefined;
    }

    return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

  private static joinWords(words: string[]): string {
    if (words.length === 1) {
      return words[0];
    }

    return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
  }
}

/**
 * Describes a valid 5-field or 6-field cron expression.
 * @param {string} expression - The cron expression to describe.
 * @returns {string} A human-readable description of the cron expression.
 */
export function describeCron(expression: string): string {
  return CronExpressionDescriber.describe(expression);
}
