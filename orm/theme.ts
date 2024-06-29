// ---- CORE IMPORTS ---- //
import {DEFAULT_THEME_OPTIONS} from '@/constants/theme';
import {Theme} from '@/types/theme';

export async function findTheme() {
  return DEFAULT_THEME_OPTIONS as Theme;
}
