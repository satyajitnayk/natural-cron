export class CronValidators {
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
}
