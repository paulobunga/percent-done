import moment from 'moment';
import 'moment/min/locales';
import { NativeModules, Platform } from 'react-native';

/**
 * Creates a string from a given date that can be
 * used as an index denoting the day in an object.
 */
export function convertDateToIndex(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function compareDateIndices(dateIdx1: string, dateIdx2: string) {
  const [year1, month1, day1] = dateIdx1.split('-').map(t => parseInt(t));
  const [year2, month2, day2] = dateIdx2.split('-').map(t => parseInt(t));

  if (year1 !== year2) {
    return year1 - year2;
  } else if (month1 !== month2) {
    return month1 - month2;
  } else {
    return day1 - day2;
  }
}

/**
 * This returns the beginning of day, as new Date() also includes the time,
 * which would prevent selectors to be memoized properly as the time changes
 * within a day.
 */
export function getBeginningOfDay(date: Date) {
  return moment(date).startOf('day').toDate();
}

export function isLocale24Hours() {
  const oneOClock = momentWithDeviceLocale(new Date(2019, 0, 1, 13));

  return oneOClock.format('LT') === '13:00';
}

export function momentWithDeviceLocale(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean) {
  let deviceLocale = Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;
  deviceLocale = deviceLocale || 'en-US';

  return moment(inp, format, strict).locale(deviceLocale);
}

export function msToHoursMinutesSeconds(ms: number): { hours: number, minutes: number, seconds: number } {
  const totalSeconds = Math.abs(ms) / 1000;
  const totalMinutes = totalSeconds / 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes - (hours * 60));
  const seconds = Math.floor(totalSeconds - (minutes * 60) - (hours * 60 * 60));

  return { hours, minutes, seconds };
}

export function formatDurationInMs(durationInMs: number, roundLastValueUp = false): string {
  let { hours, minutes, seconds } = msToHoursMinutesSeconds(durationInMs);
  const hoursStr = `${hours.toString().padStart(2, '0')}h`;

  if (roundLastValueUp && hours > 0 && !hasWholeMinutes(durationInMs)) {
    minutes++;
  } else if (roundLastValueUp && hours === 0 && !hasWholeSeconds(durationInMs)) {
    seconds++;
  }

  const minutesStr = `${minutes.toString().padStart(2, '0')}m`;
  const secondsStr = `${seconds.toString().padStart(2, '0')}s`;

  if (hours > 0) {
    return `${hoursStr} ${minutesStr}`;
  } else {
    return `${minutesStr} ${secondsStr}`;
  }
}

/**
 * Returns `true` when the ms given has a whole number of seconds.
 */
function hasWholeSeconds(ms: number): boolean {
  const secondsInMs = 1000;
  return ms % secondsInMs === 0;
}

/**
 * Returns `true` when the ms given has a whole number of seconds.
 */
function hasWholeMinutes(ms: number): boolean {
  const minutesInMs = 1000 * 60;
  return ms % minutesInMs === 0;
}

interface DeconstructFormattedDurationResult {
  firstPart: string,
  firstDenotation: string,
  secondPart: string,
  secondDenotation: string,
}

export function deconstructFormattedDuration(formattedDuration: string): DeconstructFormattedDurationResult {
  const parts = formattedDuration.split(' ');

  const firstPart = parts[0].substr(0, 2);
  const firstDenotation = parts[0].substr(2, 1);
  const secondPart = parts[1].substr(0, 2);
  const secondDenotation = parts[1].substr(2, 1);

  return { firstPart, firstDenotation, secondPart, secondDenotation };
}

export function formatTimeInTimestamp(timestamp: number, short: boolean = true): string {
  const moment = momentWithDeviceLocale(timestamp);

  if (short) return moment.format('LT');

  return moment.format('LTS');
}

export function leftOrOver(remainingMs: number) {
  return remainingMs >= 0 ? 'left' : 'over';
}
