import { Schedule, ScheduleUnit, CronTimeUnit } from './interfaces';
import { CronValidators } from './cron-validators';
import { CronUtils } from './cron-utils';

/**
 * Class to construct a cron expression with a fluent API.
 */
export class CronExpressionBuilder {
  private readonly schedule: Schedule;

  /**
   * Initializes a new instance of the CronExpressionBuilder class.
   */
  constructor() {
    this.schedule = {};
  }

  /**
   * Ensures that all parts of the cron schedule have default values.
   * This method sets defaults for minute, hour, dayOfMonth, month, and dayOfWeek
   * if they are not already specified. Defaults to '0' for minute and
   * wildcards '*' for other fields to represent "every" value.
   */
  private ensureDefaultValues(): void {
    CronUtils.setDefault(this.schedule, 'minute', '*');
    CronUtils.setDefault(this.schedule, 'hour', '*');
    CronUtils.setDefault(this.schedule, 'dayOfMonth', '*');
    CronUtils.setDefault(this.schedule, 'month', '*');
    CronUtils.setDefault(this.schedule, 'dayOfWeek', '*');
  }

  /**
   * Sets the job to run at specific minutes.
   * @param {Array<number>} minutes - Minute(s) at which the job should run.
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  atMinutes(minutes: Array<number>): this {
    minutes.forEach((minute) => CronValidators.validateMinute(minute));
    this.schedule.minute = CronUtils.formatCronPart(minutes);
    return this;
  }

  /**
   * Sets the job to run at a specific hour.
   * @param {Array<number>} hours - Hour at which the job should run.
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  atHours(hours: number[]): this {
    hours.forEach((hour) => CronValidators.validateHour(hour));
    this.schedule.hour = CronUtils.formatCronPart(hours);
    if (this.schedule.minute === undefined) {
      this.schedule.minute = '0';
    }
    return this;
  }

  /**
   * Sets the job to run at a specific time.
   * @param {string} time - Time in HH:MM format.
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  atTime(time: string): this {
    // Validate time format, expect HH:MM
    CronValidators.validateTime(time);

    const [hourStr, minuteStr] = time.split(':');
    // Remove leading zeros
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);

    // Explicitly handle the midnight and noon cases, or any other time
    this.schedule.minute = minute.toString();
    this.schedule.hour = hour.toString();

    return this;
  }

  /**
   * Sets the frequency of the job based on the specified unit.
   * @param {string} unit - The time unit (e.g., 'minute', 'hour').
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  every(unit: string): this {
    CronValidators.validateTimeUnit(unit);

    // Set the appropriate cron syntax for the unit
    switch (unit) {
      case 'minute':
        this.schedule.minute = '*';
        break;
      case 'hour':
        this.schedule.minute = '0';
        this.schedule.hour = '*';
        break;
      case 'day':
        this.schedule.minute = '0';
        this.schedule.hour = '0';
        this.schedule.dayOfMonth = '*';
        break;
      case 'month':
        this.schedule.minute = '0';
        this.schedule.hour = '0';
        this.schedule.dayOfMonth = '1';
        this.schedule.month = '*';
        break;
      case 'week':
        // For 'week', default to Sunday
        this.schedule.minute = '0';
        this.schedule.hour = '0';
        this.schedule.dayOfWeek = '0';
        // Ensure day of month and month fields do not restrict the schedule
        this.schedule.dayOfMonth = '*';
        this.schedule.month = '*';
        break;
    }

    return this;
  }

  /**
   * Sets the job to run at a specified interval for the given unit.
   * @param {ScheduleUnit} unit - The unit of time ('minute', 'hour', 'day', etc.).
   * @param {number} interval - The interval at which the job should run.
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  everyX(interval: number, unit: ScheduleUnit): this {
    // Validate the interval based on the unit
    switch (unit) {
      case CronTimeUnit.Minute:
        CronValidators.validateMinute(interval);
        this.schedule.minute = `*/${interval}`;
        this.schedule.hour = '*'; // Every X minutes, any hour
        break;
      case CronTimeUnit.Hour:
        CronValidators.validateHour(interval);
        this.schedule.minute = '0'; // Start of the hour
        this.schedule.hour = `*/${interval}`;
        break;
      case CronTimeUnit.DayOfMonth:
        CronValidators.validateDayOfMonth(interval);
        this.schedule.minute = '0';
        this.schedule.hour = '0';
        this.schedule.dayOfMonth = `*/${interval}`;
        break;
      case CronTimeUnit.Month:
        CronValidators.validateMonth(interval);
        this.schedule.minute = '0';
        this.schedule.hour = '0';
        this.schedule.dayOfMonth = '1'; // First day of the month
        this.schedule.month = `*/${interval}`;
        break;
      case CronTimeUnit.DayOfWeek:
        CronValidators.validateDayOfWeek(interval);
        this.schedule.minute = '0';
        this.schedule.hour = '0';
        this.schedule.dayOfWeek = `*/${interval}`;
        break;
    }

    return this;
  }

  /**
   * Specifies the days of the week when a job should run.
   * @param {Array<number>} days - Day(s) of the week.
   */
  onWeekDays(days: Array<number>): this {
    days.forEach((day) => CronValidators.validateDayOfWeek(day));
    this.schedule.dayOfWeek = CronUtils.formatCronPart(days);
    return this;
  }

  /**
   * Specifies the days of the month when a job should run.
   * @param {Array<number>} days - Day(s) of the month.
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  onDaysOfMonth(days: Array<number>): this {
    days.forEach((day) => CronValidators.validateDayOfMonth(day));
    this.schedule.dayOfMonth = CronUtils.formatCronPart(days);
    return this;
  }

  /**
   * Specifies the months when a job should run.
   * @param {Array<number>} months - Month(s).
   * @returns {this} The instance of CronExpressionBuilder for chaining.
   */
  duringMonths(months: Array<number>): this {
    months.forEach((month) => CronValidators.validateMonth(month));
    this.schedule.month = CronUtils.formatCronPart(months);
    return this;
  }

  /**
   * Compiles the individual parts of the schedule into a cron expression.
   * @returns {string} The cron expression representing the schedule.
   */
  public compile(): string {
    this.ensureDefaultValues();

    // Construct the cron expression using the defined schedule parts
    const minute = this.schedule.minute;
    const hour = this.schedule.hour;
    const dayOfMonth = this.schedule.dayOfMonth;
    const month = this.schedule.month;
    const dayOfWeek = this.schedule.dayOfWeek;

    // Assemble the cron expression
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }
}
