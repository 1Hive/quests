import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getDefaultProvider } from 'ethers';

const KNOWN_FORMATS = {
  onlydate: 'DD/MM/YYYY',
  iso: 'YYYY-MM-DD',
  custom: 'DD MMMM HH:mm',
};

// dayjs plugins
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

function dateFormat(date: any, format = 'onlydate') {
  return dayjs(date).format(KNOWN_FORMATS[format.toLowerCase()] || format);
}

function durationTime(ms: number) {
  return dayjs.duration(ms).humanize();
}

const toMs = (seconds: string) => parseInt(seconds, 10) * 1000;

function getRelativeTime(from: Date, to: Date) {
  return dayjs(to)
    .from(from)
    .replace(/minutes?/, 'min')
    .replace(/seconds?/, 'sec')
    .trim();
}

export async function getLastBlockTimestamp(): Promise<number> {
  return +(await getDefaultProvider().getBlock('latest')).timestamp;
}
export async function getLastBlockDate(): Promise<number> {
  return (await getLastBlockTimestamp()) * 1000;
}

export function addTime(date: Date, ms: number): Date {
  return new Date(date.getTime() + ms);
}

export const ONE_HOUR_IN_MS = 1000 * 60 * 60;
export const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;
export const ONE_WEEK_IN_MS = ONE_HOUR_IN_MS * 24 * 7;
export const ONE_YEAR_IN_MS = ONE_WEEK_IN_MS * 52;
export const IN_A_WEEK_IN_MS = Date.now() + ONE_WEEK_IN_MS;

export const msToSec = (ms: number) => Math.round(ms / 1000);

export { dayjs, dateFormat, durationTime, toMs, getRelativeTime };
