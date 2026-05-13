export type ScheduleUnit =
  | 'minute'
  | 'hour'
  | 'dayOfMonth'
  | 'month'
  | 'dayOfWeek';
export type ScheduleValue = string | number;

export interface Schedule {
  [key: string]: ScheduleValue | undefined; // Add an index signature
  minute?: ScheduleValue;
  hour?: ScheduleValue;
  dayOfMonth?: ScheduleValue;
  month?: ScheduleValue;
  dayOfWeek?: ScheduleValue;
}

export interface ParsedCronExpression {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface ParsedCronExpressionWithSeconds extends ParsedCronExpression {
  second: string;
}

export type ParsedCronSchedule =
  | ParsedCronExpression
  | ParsedCronExpressionWithSeconds;

export enum CronTimeUnit {
  Minute = 'minute',
  Hour = 'hour',
  DayOfMonth = 'dayOfMonth',
  Month = 'month',
  DayOfWeek = 'dayOfWeek',
}
