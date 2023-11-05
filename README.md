# Natural Cron

Natural Cron is a easy-to-use Node.js library for creating and validating cron expressions with natural, human-readable APIs.

## Features

- Chainable methods for constructing cron expressions.
- Validation of cron components (minute, hour, day of the month, month, day of the week).
- Helpful error messages for invalid input.
- TypeScript support for strong typing and intellisense.

## Installation

Install using npm:

```bash
npm install natural-cron
```

Or using yarn:

```bash
yarn add natural-cron
```

## Usages

Utilize `CronExpressionBuilder` to generate cron expressions for various scheduling scenarios.

```ts
const { CronExpressionBuilder, CronValidators } = require('natural-cron');
const schedule = new  CronExpressionBuilder();
```

## 📋 Examples Table

| 📅 Description                                     | 💻 Code Example                                                                                                     | ⏰ Cron Expression      |
|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|------------------------|
| Run a job at 5:30 PM every day                     | `schedule.atTime('17:30').compile();`                                                                         | `30 17 * * *`          |
| Run at 9 AM on weekdays                            | `schedule.atTime('09:00').onWeekDays([1,2,3,4,5]).compile();`                                                 | `0 9 * * 1-5`          |
| Run at noon on the 1st and 15th of the month       | `schedule.atTime('12:00').onDaysOfMonth([1, 15]).compile();`                                                  | `0 12 1,15 * *`        |
| Run at midnight during January and July            | `schedule.atTime('00:00').duringMonths([1, 7]).compile();`                                                    | `0 0 * 1,7 *`          |
| Run every 15 minutes                               | `schedule.everyX(15, CronTimeUnit.Minute).compile();`                                                          | `*/15 * * * *`         |
| Run every day at noon                              | `schedule.every('day').atHours([12]).compile();`                                                              | `0 12 * * *`           |
| Run every Sunday at 5 PM                           | `schedule.onWeekDays([0]).atHours([17]).compile();`                                                           | `0 17 * * 0`           |
| Run the 1st day of every month at 1 AM             | `schedule.onDaysOfMonth([1]).every('month').atHours([1]).compile();`                                          | `0 1 1 * *`            |
| Run every weekday at 8:30 AM                       | `schedule.atTime("08:30").onWeekDays([1, 2, 3, 4, 5]).compile();`                                             | `30 8 * * 1-5`         |
| Run every 6 hours                                  | `schedule.everyX(6, CronTimeUnit.Hour).compile();`                                                             | `0 */6 * * *`          |
| Run every quarter at midnight                      | `schedule.duringMonths([1, 4, 7, 10]).onDaysOfMonth([1]).atTime("00:00").compile();`                          | `0 0 1 1,4,7,10 *`     |
| Run every Saturday and Sunday at 10:15 AM          | `schedule.atTime("10:15").onWeekDays([6, 0]).compile();`                                                      | `15 10 * * 6,0`        |
| Run at 9 AM, 12 PM, and 3 PM every day             | `schedule.every('day').atHours([9, 12, 15]).compile();`                                                       | `0 9,12,15 * * *`      |
| Run at 7 AM, 2 PM, and 10 PM on Tuesdays           | `schedule.atHours([7, 14, 22]).onWeekDays([2]).compile();`                                                    | `0 7,14,22 * * 2`      |
| Run at 20 past every hour on the 5th of July       | `schedule.atMinutes([20]).onDaysOfMonth([5]).duringMonths([7]).compile();`                                    | `20 * 5 7 *`           |
| Run every 5 minutes during office hours - every()  | `schedule.every('minute').atMinutes([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]).atHours([9-16]).compile();` | `0,5,10,15,20,25,30,35,40,45,50,55 9-16 * * *`       |
| Run every 5 minutes during office hours - everyX() | `schedule.everyX(5,CronTimeUnit.Minute).atHours([9, 10, 11, 12, 13, 14, 15, 16]).compile()` | `*/5 9-16 * * *`       |
| Run at quarter past and quarter to every hour      | `schedule.every('hour').atMinutes([15, 45]).compile();`                                                        | `15,45 * * * *`        |

> Note: `schedule` is an instance of `CronExpressionBuilder` utilized for generating the cron expressions.

### API Reference

#### CronExpressionBuilder

- `atMinutes(minutes: Array<number>): this`
- `atHours(hours: Array<number>): this`
- `atTime(time: string): this`
- `every(unit: string): this`
- `everyX(interval: number, unit: ScheduleUnit): this`
- `onWeekdays(days: Array<number>): this`
- `onDaysOfMonth(days: Array<number>): this`
- `duringMonths(months: Array<number>): this`
- `compile(): string` - Get the cron expression

```typescript
export type ScheduleUnit = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek' ;
```

#### CronValidators

Static methods for validating cron expression components.

- `validateMinute(minute: number)`
- `validateHour(hour: number)`
- `validateDayOfMonth(day: number)`
- `validateMonth(month: number)`
- `validateDayOfWeek(day: number)`
- `validateTime(time: string)`

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details.
