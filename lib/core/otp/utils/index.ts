// ---- LOCAL IMPORTS ---- /
import {DEFAULT_OTP_DIGIT, DEFAULT_OTP_EXPIRY} from '../constants';

export function generate(digit: number = DEFAULT_OTP_DIGIT) {
  if (digit <= 0) {
    throw new Error('Digit must be greater than 0');
  }

  const min = Math.pow(10, digit - 1);
  const max = Math.pow(10, digit) - 1;

  const otp = Math.floor(min + Math.random() * (max - min + 1));

  return otp.toString();
}

export function computeExpiry(
  minutes: number = DEFAULT_OTP_EXPIRY,
  iso?: boolean,
) {
  if (minutes <= 0) {
    throw new Error('Minutes must be greater than 0');
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + minutes * 60000);

  return iso ? expiry?.toISOString() : expiry;
}

export function isExpired(expiryTime: string | Date) {
  const now = new Date();
  return now >= new Date(expiryTime);
}
