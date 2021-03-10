import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'

const KNOWN_FORMATS = {
  onlyDate: 'DD/MM/YYYY',
  iso: 'YYYY-MM-DD',
  custom: 'DD MMMM HH:mm',
}

// dayjs plugins
dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)

function dateFormat(date, format = 'onlyDate') {
  return dayjs(date).format(KNOWN_FORMATS[format] || format)
}

function durationTime(ms) {
  return dayjs.duration(ms).humanize()
}

export function noop() {}

const toMs = (seconds) => parseInt(seconds) * 1000

export { dayjs, dateFormat, durationTime, toMs }
