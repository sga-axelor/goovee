import {VERSION_MISMATCH_ERROR} from '../constants';
import type {ErrorResponse} from './types';

export function handleError(e: unknown): ErrorResponse {
  if (e instanceof Error) {
    if (e.name === VERSION_MISMATCH_ERROR) {
      return {error: true, message: e.name};
    }
    return {error: true, message: e.message};
  }
  throw e;
}
