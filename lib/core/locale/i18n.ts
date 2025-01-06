import axios from 'axios';
import {translate} from '@/locale/utils';
import {DEFAULT_LOCALE} from '@/locale';

const rest = axios.create();

export const i18n = (() => {
  let translations: Record<string, string> = {};

  async function load(locale: string = DEFAULT_LOCALE, tenant?: string) {
    if (!locale) {
      return {};
    }

    if (tenant) {
      try {
        const result = await rest.get(
          `${process.env.NEXT_PUBLIC_HOST}/api/tenant/${tenant}/locales/${locale}`,
        );

        if (result?.data) {
          translations = {
            ...result?.data,
          };
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const result = await rest.get(`/locales/${locale}.json`);

        if (result?.status === 200 && result?.data) {
          translations = {
            ...result?.data,
          };
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  function t(text: string, ...interpolations: string[]) {
    return translate(translations, text, ...interpolations);
  }

  function tattr(text: string, ...interpolations: string[]) {
    const key = `value:${text}`;
    const value = t(key, ...interpolations);
    const translated = key !== value;

    return translated ? value : t(text);
  }

  return {
    load,
    t,
    tattr,
    translations,
  };
})();
