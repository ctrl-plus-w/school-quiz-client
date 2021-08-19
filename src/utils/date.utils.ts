import { DAYS, MONTHS } from '@constant/date';

/**
 * Return a date with the given day changed.
 * @param date The date to modify the day.
 * @param value The new date value.
 * @returns A date
 */
export const setDate = (date: Date, value: number): Date => {
  const tempDate = new Date(date);
  tempDate.setDate(value);
  return tempDate;
};

/**
 * Return a date with the given month changed.
 * @param date The date to modify the month.
 * @param value The new month value.
 * @returns A date
 */
export const setMonth = (date: Date, value: number): Date => {
  const tempDate = new Date(date);
  tempDate.setMonth(value);
  return tempDate;
};

/**
 * Return a date with its date incremented by the amount.
 * @param date The date to increment the day.
 * @param amount The amount of days to increment the date.
 * @returns A date
 */
export const incrementDate = (date: Date, amount: number): Date => {
  return setDate(date, date.getDate() + amount);
};

/**
 * Return a date with its month incremented by the amount.
 * @param date The date to increment the months.
 * @param amount The amount of months to increment the date.
 * @returns A date
 */
export const incrementMonth = (date: Date, amount: number): Date => {
  return setMonth(date, date.getMonth() + amount);
};

/**
 * Get the french month from the Date month index
 * @param month The Month index
 * @returns A string
 */
export const monthToString = (month: number): string => {
  return MONTHS[month];
};

/**
 * Get the date of the first day in the month which contains the date
 * @param date The date in the month
 * @returns A date
 */
export const getMonthFirstDate = (date: Date): Date => {
  return setDate(new Date(date), 1);
};

/**
 * Get the date of the last day in the month which contains the date
 * @param date The date in the month
 * @returns A date
 */
export const getMonthLastDate = (date: Date): Date => {
  return setDate(incrementMonth(new Date(date), 1), 0);
};

/**
 * Get the first day of the week which contains the date
 * @param date The date in the week
 * @returns A date
 */
export const getWeekFirstDate = (date: Date): Date => {
  const day = date.getDay();
  return setDate(date, date.getDate() - (day === 0 ? 6 : day + 1));
};

/**
 * Get the last day of the week which contains the date
 * @param date The date in the week
 * @returns A date
 */
export const getWeekLastDate = (date: Date): Date => {
  const day = date.getDay();
  return setDate(date, date.getDate() + (day === 0 ? 0 : 7 - day));
};

/**
 * Know if a given date is in a given month
 * @param date The reference date
 * @param dateToFind The date to find in the month
 * @returns A boolean
 */
export const isDateInMonth = (date: Date, dateToFind: Date): boolean => {
  return dateToFind.valueOf() >= getMonthFirstDate(date).valueOf() && dateToFind.valueOf() <= getMonthLastDate(date).valueOf();
};

/**
 * Get a calendar array (6 rows of 7 days, all starting a monday and ending a sunday)
 * @param date The date which is in the calendar
 * @returns An array of array of dates
 */
export const getCalendarDates = (date: Date): Array<Date> => {
  const dates = [];

  // There is 42 days in a month calendar -> 7 days x 6 weeks
  for (let i = 0; i < 42; i++) {
    dates.push(incrementDate(getWeekFirstDate(getMonthFirstDate(date)), i));
  }

  return dates;
};

/**
 * Check if the date have the same date (not the week day)
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameDay = (date: Date, date1: Date): boolean => date.getDate() === date1.getDate();

/**
 * Check if the date have the same month
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameMonth = (date: Date, date1: Date): boolean => date.getMonth() === date1.getMonth();

/**
 * Check if the date have the same year
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameYear = (date: Date, date1: Date): boolean => date.getFullYear() === date1.getFullYear();

/**
 * Check if the date are the same
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameDate = (date: Date, date1: Date): boolean => {
  for (const func of [isSameDay, isSameMonth, isSameYear]) if (!func(date, date1)) return false;
  return true;
};

/**
 * Format a date into a string
 * @param date The date to format
 * @returns A string
 */
export const formatDate = (date: Date): string => {
  const today = new Date();

  if (isSameDate(date, today)) return `Aujourd'hui, ${date.getDate()} ${monthToString(date.getMonth())}`;
  if (isSameDate(date, incrementDate(today, 1))) return `Demain, ${date.getDate()} ${monthToString(date.getMonth())}`;

  return `${DAYS[date.getDay()]} ${date.getDate()} ${monthToString(date.getMonth())}`;
};