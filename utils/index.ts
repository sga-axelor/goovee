import moment from "moment";
import { DEFAULT_CURRENCY_SYMBOL, DEFAULT_SCALE } from "@/constants";

export function clone(obj: any) {
  return obj && JSON.parse(JSON.stringify(obj));
}

export function scale(n: number | string, s: number = DEFAULT_SCALE) {
  return n && Number(n).toFixed(s);
}

export function capitalise(text: string) {
  return text && text.charAt(0).toUpperCase() + text.slice(1);
}

export function parseDate(date: any) {
  return moment(date).format("MM/DD/YYYY");
}

export function formatPrice(
  num: number | string,
  currency: string = DEFAULT_CURRENCY_SYMBOL,
  decimals: number = 2
) {
  return `${Math.max(0, Number(num))
    .toFixed(decimals)
    .replace(/(?=(?:\d{3})+$)(?!^)/g, ",")} ${currency}`;
}

export function isNumeric(str: string) {
  if (typeof str != "string") return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function getCityName(addressl6: string) {
  const city = addressl6.split(" ").pop();
  return city;
}

export function getFormattedValue(
  value: string,
  unit: number,
  currencySymbol: string
) {
  const $value = `${scale(value, unit)} ${currencySymbol}`;
  return $value;
}

export function getPageInfo({
  count = 0,
  limit,
  page,
}: {
  count?: number | string;
  limit?: number | string;
  page?: number | string;
}) {
  const pages = Math.ceil(Number(count) / Number(limit));

  return {
    count,
    limit,
    page,
    pages,
    hasNext: Number(page) < Number(pages),
    hasPrev: Number(page) > 1,
  };
}

export function getSkipInfo(limit?: string | number, page?: string | number) {
  return Number(limit) * Math.max(Number(page) - 1, 0);
}
