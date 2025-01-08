import path from 'path';
import fs from 'fs/promises';
import {cache} from 'react';

import {manager} from '@/tenant';
import {DEFAULT_LOCALE} from '@/locale/contants';
import {findLocaleLanguage} from '@/locale/utils';

const tcache: Record<string, Record<string, string>> = {};

const includeLanguage = () => {
  return process.env.INCLUDE_LANGUAGE === 'true';
};

const findGeneralTranslations = cache(async function findGeneralTranslations(
  locale: string,
  keys?: string[],
) {
  if (!locale) {
    return {};
  }

  let data: Record<string, string> = {};
  const locales = path.resolve(process.cwd(), 'public', 'locales');

  const readFile = async (l: string) => {
    try {
      const filepath = path.resolve(locales, `${l}.json`);
      return JSON.parse(await fs.readFile(filepath, 'utf8'));
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  // locale language
  const lang = findLocaleLanguage(locale);

  const readwritecache = async (l: string) => {
    if (tcache[lang]) {
      return tcache[lang];
    } else {
      const result = await readFile(l);
      tcache[lang] = result;
      return result;
    }
  };

  if (lang !== locale && includeLanguage()) {
    data = {...data, ...(await readwritecache(lang))};
  }

  data = {...data, ...(await readwritecache(locale))};

  if (keys) {
    keys.reduce((a, k) => ({...a, [k]: data[k]}), {});
  }

  return data;
});

const findTenantTranslations = cache(async function findTenantTranslations(
  locale: string,
  tenant: string,
  keys?: string[],
) {
  if (!(locale && tenant)) {
    return {};
  }

  let data: Record<string, string> = {};

  const find = async (locale: string) => {
    try {
      const client = await manager.getClient(tenant);
      return client.aOSMetaTranslation
        .find({where: {language: locale, ...(keys ? {key: {in: keys}} : {})}})
        .then(t => {
          console.log('t.length', t.length, keys);
          return t;
        })
        .then(t =>
          t?.reduce((a, t) => (t?.key ? {...a, [t.key]: t.value} : a), {}),
        );
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  // locale language
  const lang = findLocaleLanguage(locale);

  await Promise.all([
    ...(lang !== locale && includeLanguage() ? [find(lang)] : []),
    find(locale),
  ]).then(([langTranslations, translations]) => {
    data = {...data, ...langTranslations, ...translations};
  });

  return data;
});

export const findTranslations = cache(async function findTranslations(
  locale: string = DEFAULT_LOCALE,
  tenant?: string,
  keys?: string[],
) {
  if (!locale) {
    return {};
  }

  let data: Record<string, string> = {};

  data = {...data, ...(await findGeneralTranslations(locale, keys))};

  if (tenant) {
    data = {...data, ...(await findTenantTranslations(locale, tenant, keys))};
  }

  return data;
});
