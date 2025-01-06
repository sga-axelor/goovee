import path from 'path';
import fs from 'fs/promises';

import {manager} from '@/tenant';
import {DEFAULT_LOCALE} from '@/locale/contants';

export async function findTranslations(
  locale: string = DEFAULT_LOCALE,
  tenant?: string,
) {
  if (!locale) {
    return {};
  }

  const data: Record<string, string> = {};

  // default
  try {
    const localesdir = path.resolve(process.cwd(), 'public', 'locales');
    const filepath = path.resolve(localesdir, `${locale}.json`);
    let translations = JSON.parse(await fs.readFile(filepath, 'utf8'));
    Object.assign(data, translations);
  } catch (err) {
    console.error(err);
  }

  try {
    if (tenant) {
      // tenant specific
      const client = await manager.getClient(tenant);
      const translations = await client.aOSMetaTranslation
        .find({
          where: {
            language: locale,
          },
        })
        .then(result => {
          const $translations: any = {};
          result.forEach((t: any) => {
            if (t.key) {
              $translations[t.key] = t.value;
            }
          });
          return $translations;
        });
      Object.assign(data, translations);
    }
  } catch (err) {
    console.error(err);
  }

  return data;
}
