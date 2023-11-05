import {Schedule} from "./interfaces";

export class CronUtils {
  /**
   * Checks if the numbers in an array are contiguous.
   * @param {Array<number>} numbers - An array of numbers to check.
   * @returns {boolean} - True if the numbers form a contiguous sequence.
   */
  static isContiguous(numbers: Array<number>): boolean {
    // Sort the array to check for contiguity
    let sortedNumbers = [...numbers].sort((a, b) => a - b);
    for (let i = 1; i < sortedNumbers.length; i++) {
      if (sortedNumbers[i] !== sortedNumbers[i - 1] + 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * Formats a list of numbers into a cron-compatible string.
   * @param {Array<number>} values - An array of numbers.
   * @returns {string} - A cron-formatted string.
   */
  static formatCronPart(values: Array<number>): string {
    // Ensure values are sorted and unique
    const uniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);

    // Check if the values form a contiguous range
    const contiguous = CronUtils.isContiguous(uniqueValues);

    // Convert all values to a comma-separated string or a range for the cron expression
    return contiguous && uniqueValues.length > 2
      ? `${uniqueValues[0]}-${uniqueValues[uniqueValues.length - 1]}`
      : uniqueValues.join(',');
  }

  /**
   * Sets a default value for a given key in a schedule object if it's not already set.
   * @param {Schedule} schedule - The schedule object.
   * @param {string} field - The key to check in the schedule.
   * @param {string | number} defaultValue - The default value to set if the key is undefined.
   */
  static setDefault(schedule: Schedule, field: string, defaultValue: string | number): void {
    if (schedule[field] === undefined) {
      schedule[field] = defaultValue;
    }
  }
}
