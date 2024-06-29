// ---- CORE IMPORTS ---- //
import {DEFAULT_THEME_OPTIONS} from '@/constants/theme';
import {ThemeOptions} from '@/types/theme';

export async function findThemeOptions() {
  return DEFAULT_THEME_OPTIONS as ThemeOptions;
}
