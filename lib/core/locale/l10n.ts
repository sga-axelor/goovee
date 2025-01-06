import dayjs from 'dayjs';
import dayjsLocale from 'dayjs/locale.json';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import calendar from 'dayjs/plugin/calendar';
import kebabCase from 'lodash/kebabCase';

import {DEFAULT_LOCALE, DEFAULT_DATE_FORMAT} from '@/locale/contants';
import {limitScale} from '@/locale/formatters';

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(calendar);

const getNormalizedLocale = (locale: string) => kebabCase(locale);
const getCountry = (locale: string) => kebabCase(locale).split('-')[1];

async function initDayjs(locale: string) {
  const data = await findDayjsLocale(locale);
  dayjs.locale(data);
  return data;
}

async function findDayjsLocale(locale: string) {
  const supportedLocales = dayjsLocale.map(locale => locale.key);
  const found = _findLocale(supportedLocales, locale);
  if (found) {
    try {
      const {default: data} = await import(`dayjs/esm/locale/${found}.js`);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  return null;
}

function _findLocale(
  locales: readonly string[],
  locale: string,
  tr = getNormalizedLocale,
) {
  const parts = getNormalizedLocale(locale).split('-');
  for (let i = parts.length; i > 0; --i) {
    const current = parts.slice(0, i).join('-');
    const found = locales.find(item => tr(item) === current);
    if (found) {
      return found;
    }
  }

  return null;
}

function findDateFormat(locale: string, dateFormat: string, data: any) {
  if (data) {
    const format = data?.formats?.L;
    if (format) {
      return format
        .replace(/\u200f/g, '') // ar
        .replace(/YYYY年MMMD日/g, 'YYYY-MM-DD') // zh-tw
        .replace(/MMM/g, 'MM') // Don't support MMM
        .replace(/\bD\b/g, 'DD') // D -> DD
        .replace(/\bM\b/g, 'MM'); // M -> MM
    } else if (locale == 'en' || getCountry(locale) === 'us') {
      // dayjs has no locale "en-us", and locale "en" has undefined formats
      return 'MM/DD/YYYY';
    }
  }
  return dateFormat || DEFAULT_DATE_FORMAT;
}

export const l10n = (() => {
  let locale = '';
  let dateFormat = DEFAULT_DATE_FORMAT;

  async function init(l?: string) {
    locale = l || navigator.language || DEFAULT_LOCALE;
    const dayjsLocale = await initDayjs(locale);
    dateFormat = findDateFormat(locale, dateFormat, dayjsLocale);
  }

  function getLocale() {
    return locale;
  }

  function getDateFormat() {
    return dateFormat;
  }

  function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
    let {minimumFractionDigits, maximumFractionDigits} = options ?? {};
    minimumFractionDigits = limitScale(minimumFractionDigits);
    maximumFractionDigits = limitScale(maximumFractionDigits);
    return new Intl.NumberFormat(locale, {
      ...options,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  return {
    init,
    getLocale,
    getDateFormat,
    formatNumber,
  };
})();

export {default as dayjs, type Dayjs} from 'dayjs';
