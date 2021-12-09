import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';

const KNOWN_FORMATS = {
  onlyDate: 'DD/MM/YYYY',
  iso: 'YYYY-MM-DD',
  custom: 'DD MMMM HH:mm',
};

// dayjs plugins
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

function dateFormat(date: any, format = 'onlyDate') {
  return dayjs(date).format(KNOWN_FORMATS[format] || format);
}

function durationTime(ms: number) {
  return dayjs.duration(ms).humanize();
}

const toMs = (seconds: string) => parseInt(seconds, 10) * 1000;

export const ONE_HOUR_IN_MS = 1000 * 60 * 60;
export const ONE_WEEK_IN_MS = ONE_HOUR_IN_MS * 24 * 7;
export const ONE_YEAR_IN_MS = ONE_WEEK_IN_MS * 52;
export const IN_A_WEEK_IN_MS = Date.now() + ONE_WEEK_IN_MS;

export { dayjs, dateFormat, durationTime, toMs };
