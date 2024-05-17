import { ThemeOptions } from "@axelor/ui/core/styles/theme/types";

// ---- CORE IMPORTS ---- //
import { DEFAULT_THEME_OPTIONS } from "@/constants/theme";

export async function findThemeOptions() {
  return DEFAULT_THEME_OPTIONS as ThemeOptions;
}
