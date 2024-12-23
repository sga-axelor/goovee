import {useEffect, useMemo, useState} from 'react';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {toTitleCase} from '@/utils/names';
import {DEFAULT_LANGUAGE_CODE} from '@/constants';

const RTL_LANGS = [
  'ar', // Arabic
  'fa', // Persian
  'he', // Hebrew
  'ur', // Urdu
];

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
function toLangTag(lang: string) {
  const parts = lang.split(/-|_/g);
  if (parts.length > 0) parts[0] = parts[0].toLowerCase();
  if (parts.length === 2) parts[1] = parts[1].toUpperCase();
  if (parts.length === 3) {
    parts[1] = toTitleCase(parts[1]);
    parts[2] = parts[2].toUpperCase();
  }
  return parts.join('-');
}

const isRTL = (lang: string) =>
  RTL_LANGS.some(x => lang === x || lang.startsWith(`${x}-`));

export function useAppLang() {
  const [locale, setLocale] = useState(DEFAULT_LANGUAGE_CODE);
  const {data: session} = useSession();
  const user = session?.user;
  const language = user?.language;

  useEffect(() => {
    const locale = language || navigator.language || navigator?.userLanguage;
    locale && setLocale(locale);
  }, [language]);

  const lang = useMemo(() => toLangTag(locale), [locale]);
  const dir = useMemo(() => (isRTL(lang) ? 'rtl' : 'ltr'), [lang]);

  return useMemo(
    () => ({
      dir,
      lang,
    }),
    [lang, dir],
  );
}
