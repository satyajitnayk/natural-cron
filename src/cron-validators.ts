export class CronValidators {
  private static readonly cronFields = [
    { name: 'minute', min: 0, max: 59 },
    { name: 'hour', min: 0, max: 23 },
    { name: 'day of month', min: 1, max: 31 },
    { name: 'month', min: 1, max: 12 },
    { name: 'day of week', min: 0, max: 6 },
  ];

  private static readonly cronFieldsWithSeconds = [
    { name: 'second', min: 0, max: 59 },
    ...CronValidators.cronFields,
  ];

  /**
   * Validates if the given minute is within the cron range of 0 to 59.
   * @param {number} minute - The minute value to validate.
   * @throws Will throw an error if the minute is not within the range of 0 to 59.
   */
  static validateMinute(minute: number): void {
    if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
      throw new Error(
        `Invalid minute: ${minute}. Minute should be between 0 and 59.`,
      );
    }
  }

  /**
   * Validates if the given hour is within the cron range of 0 to 23.
   * @param {number} hour - The hour value to validate.
   * @throws Will throw an error if the hour is not within the range of 0 to 23.
   */
  static validateHour(hour: number): void {
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
      throw new Error(
        `Invalid hour: ${hour}. Hour should be between 0 and 23.`,
      );
    }
  }

  /**
   * Validates if the given day of the month is within the cron range of 1 to 31.
   * @param {number} day - The day of the month to validate.
   * @throws Will throw an error if the day is not within the range of 1 to 31.
   */
  static validateDayOfMonth(day: number): void {
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw new Error(
        `Invalid day of month: ${day}. Day should be between 1 and 31.`,
      );
    }
  }

  /**
   * Validates if the given month is within the cron range of 1 to 12.
   * @param {number} month - The month value to validate.
   * @throws Will throw an error if the month is not within the range of 1 to 12.
   */
  static validateMonth(month: number): void {
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new Error(
        `Invalid month: ${month}. Month should be between 1 and 12.`,
      );
    }
  }

  /**
   * Validates if the given day of the week is within the cron range of 0 (Sunday) to 6 (Saturday).
   * @param {number} day - The day of the week to validate.
   * @throws Will throw an error if the day is not within the range of 0 to 6.
   */
  static validateDayOfWeek(day: number): void {
    if (!Number.isInteger(day) || day < 0 || day > 6) {
      throw new Error(
        `Invalid day of week: ${day}. Day should be between 0 (Sunday) and 6 (Saturday).`,
      );
    }
  }

  /**
   * Validates the format of a cron time string.
   * @param {string} time - The time string to validate in HH:MM format.
   * @throws Will throw an error if the time format does not match HH:MM.
   */
  static validateTime(time: string): void {
    const timePattern = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/;
    if (!timePattern.test(time)) {
      throw new Error(`Invalid time format for 'at': ${time}`);
    }
  }

  /**
   * Validates if the given time unit is a valid cron time unit.
   * @param {string} unit - The time unit to validate (e.g., 'minute', 'hour', etc.).
   * @throws Will throw an error if the unit is not a valid cron time unit.
   */
  static validateTimeUnit(unit: string): void {
    const validUnits = ['minute', 'hour', 'day', 'month', 'week'];
    if (!validUnits.includes(unit)) {
      throw new Error(`Invalid time unit for cron: ${unit}`);
    }
  }

  /**
   * Validates a full cron expression with either 5 fields or 6 fields when seconds are included.
   * @param {string} expression - The cron expression to validate.
   * @throws Will throw an error if the expression is not valid cron syntax.
   */
  static validateExpression(expression: string): void {
    if (typeof expression !== 'string' || expression.trim().length === 0) {
      throw new Error('Invalid cron expression: expression must not be empty.');
    }

    const parts = expression.trim().split(/\s+/);

    if (parts.length !== 5 && parts.length !== 6) {
      throw new Error(
        `Invalid cron expression: expected 5 or 6 fields, received ${parts.length}.`,
      );
    }

    const fields =
      parts.length === 6
        ? CronValidators.cronFieldsWithSeconds
        : CronValidators.cronFields;

    parts.forEach((part, index) => {
      const field = fields[index];
      CronValidators.validateCronField(part, field.name, field.min, field.max);
    });
  }

  /**
   * Checks whether a full cron expression is valid.
   * @param {string} expression - The cron expression to validate.
   * @returns {boolean} True when the expression is valid.
   */
  static isValidExpression(expression: string): boolean {
    try {
      CronValidators.validateExpression(expression);
      return true;
    } catch (_error) {
      return false;
    }
  }

  private static validateCronField(
    value: string,
    fieldName: string,
    min: number,
    max: number,
  ): void {
    const listParts = value.split(',');

    if (listParts.some((part) => part.length === 0)) {
      throw new Error(`Invalid ${fieldName}: ${value}. Empty list item found.`);
    }

    listParts.forEach((part) => {
      CronValidators.validateCronFieldPart(part, fieldName, min, max);
    });
  }

  private static validateCronFieldPart(
    value: string,
    fieldName: string,
    min: number,
    max: number,
  ): void {
    const stepParts = value.split('/');

    if (stepParts.length > 2 || stepParts.some((part) => part.length === 0)) {
      throw new Error(`Invalid ${fieldName}: ${value}. Invalid step syntax.`);
    }

    const [base, step] = stepParts;

    if (step !== undefined) {
      CronValidators.validateCronNumber(step, fieldName, 1, max);
    }

    if (base === '*') {
      return;
    }

    if (base.includes('-')) {
      CronValidators.validateCronRange(base, fieldName, min, max);
      return;
    }

    CronValidators.validateCronNumber(base, fieldName, min, max);
  }

  private static validateCronRange(
    value: string,
    fieldName: string,
    min: number,
    max: number,
  ): void {
    const rangeParts = value.split('-');

    if (
      rangeParts.length !== 2 ||
      rangeParts[0].length === 0 ||
      rangeParts[1].length === 0
    ) {
      throw new Error(`Invalid ${fieldName}: ${value}. Invalid range syntax.`);
    }

    const [startValue, endValue] = rangeParts;
    const start = CronValidators.validateCronNumber(
      startValue,
      fieldName,
      min,
      max,
    );
    const end = CronValidators.validateCronNumber(
      endValue,
      fieldName,
      min,
      max,
    );

    if (start > end) {
      throw new Error(
        `Invalid ${fieldName}: ${value}. Range start should be less than or equal to range end.`,
      );
    }
  }

  private static validateCronNumber(
    value: string,
    fieldName: string,
    min: number,
    max: number,
  ): number {
    if (!/^\d+$/.test(value)) {
      throw new Error(
        `Invalid ${fieldName}: ${value}. Value should be an integer.`,
      );
    }

    const numberValue = Number(value);

    if (
      !Number.isInteger(numberValue) ||
      numberValue < min ||
      numberValue > max
    ) {
      throw new Error(
        `Invalid ${fieldName}: ${value}. Value should be between ${min} and ${max}.`,
      );
    }

    return numberValue;
  }
}
