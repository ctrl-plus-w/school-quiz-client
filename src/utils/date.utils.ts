import { formatNumber, str } from './mapper.utils';

import { DAYS, MONTHS } from '@constant/date';

/**
 * Return a date with the given minutes changed.
 * @param date The date to modify the minutes.
 * @param value The new minutes value.
 * @returns A date
 */
export const setMinutes = (date: Date, value: number): Date => {
  const tempDate = new Date(date);
  tempDate.setMinutes(value);
  return tempDate;
};

/**
 * Return a date with the given hours changed.
 * @param date The date to modify the hours.
 * @param value The new hours value.
 * @returns A date
 */
export const setHours = (date: Date, value: number): Date => {
  const tempDate = new Date(date);
  tempDate.setHours(value);
  return tempDate;
};

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
 * Return a date with its minutes incremented by the amount.
 * @param date The date to increment the minutes.
 * @param amount The amount of minutes to increment the date.
 * @returns A date
 */
export const incrementMinutes = (date: Date, amount: number): Date => {
  return setMinutes(date, date.getMinutes() + amount);
};

/**
 * Return a date with its hours incremented by the amount.
 * @param date The date to increment the hours.
 * @param amount The amount of hours to increment the date.
 * @returns A date
 */
export const incrementHours = (date: Date, amount: number): Date => {
  return setHours(date, date.getHours() + amount);
};

/**
 * Return a date with its hours and minutes incremented by the given amount.
 * @param date The date to increment the time from
 * @param hours The amount of hours to increment
 * @param minutes The amount of minutes to increment
 * @returns A date
 */
export const incrementTime = (date: Date, hours: number, minutes: number): Date => {
  return incrementHours(incrementMinutes(date, minutes), hours);
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
 * Check if the date have the hours and minutes
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameTime = (date: Date, date1: Date): boolean => {
  return date.getHours() === date1.getHours() && date.getMinutes() === date1.getMinutes();
};

/**
 * Check if the date have the same date (not the week day)
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameDay = (date: Date, date1: Date): boolean => date.getDate() === date1.getDate();

/**
 * Check if the date have the same date and time
 * @param date The first date to compare
 * @param date1 The second date to compare
 * @returns A boolean
 */
export const isSameDateTime = (date: Date, date1: Date): boolean => {
  return isSameDate(date, date1) && isSameTime(date, date1);
};

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
export const formatDate = (_date: Date | string): string => {
  const date = typeof _date === 'string' ? new Date(_date) : _date;
  const today = new Date();

  if (isSameDate(date, today)) return `Aujourd'hui, ${date.getDate()} ${monthToString(date.getMonth())}`;
  if (isSameDate(date, incrementDate(today, 1))) return `Demain, ${date.getDate()} ${monthToString(date.getMonth())}`;

  return `${DAYS[date.getDay()]} ${date.getDate()} ${monthToString(date.getMonth())}`;
};

/**
 * Format a datetime into a string
 * @param date The datetime to format
 * @returns A string
 */
export const formatDateTime = (_date: Date | string): string => {
  const date = typeof _date === 'string' ? new Date(_date) : _date;
  return `${formatDate(_date)} à ${date.getHours()}h${formatNumber(date.getMinutes())}`;
};

/**
 * Modify the hours and minutes of a date
 * @param date The date to modify
 * @param hours The new hours to set
 * @param minutes The new minutes to set
 * @returns A date
 */
export const setTime = (date: Date, hours: number, minutes: number, seconds = 0, ms = 0): Date => {
  const tempDate = new Date(date);
  tempDate.setHours(hours);
  tempDate.setMinutes(minutes);
  tempDate.setSeconds(seconds);
  tempDate.setMilliseconds(ms);
  return tempDate;
};

/**
 * Get an array representing an hour
 * @param date The date to get the time array from
 * @returns An array representing an hour, e.g [15, 5] -> 15h05
 */
export const getTimeAsArray = (date: Date): [string, string] => {
  return [formatNumber(str(date.getHours())), formatNumber(str(date.getMinutes()))];
};

/**
 * Get an array representing the difference between date as an hour
 * @param date The younger date
 * @param date1 The older date to compare
 * @returns An array representing an hour, e.g [15, 5] -> 15h05
 */
export const getTimeArrayFromDifference = (date: Date, date1: Date): [string, string] => {
  const msDiff = date1.valueOf() - date.valueOf();
  return [formatNumber(str(Math.floor((msDiff / (1000 * 60 * 60)) % 24))), formatNumber(str(Math.floor((msDiff / (1000 * 60)) % 60)))];
};

/**
 * Check if the date is after today (at 23:59)
 * @param date The date to check
 * @returns A boolean
 */
export const isInFuture = (date: Date): boolean => {
  return date.valueOf() > setTime(new Date(), 25, 0, 0, 0).valueOf();
};
