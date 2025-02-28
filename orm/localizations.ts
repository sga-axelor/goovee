import {DEFAULT_LOCALE} from '@/locale/contants';
import {findLocaleLanguage, inverseTransformLocale} from '@/locale/utils';
import {Tenant, manager} from '@/tenant';
import {clone} from '@/utils';

export async function findLocalizations({tenantId}: {tenantId: Tenant['id']}) {
  if (!tenantId) {
    return [];
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    return [];
  }

  const localizations = await client.aOSLocalization
    .find({
      select: {
        name: true,
        code: true,
      },
      where: {
        isAvailableOnPortal: true,
      },
    })
    .then(clone);

  return localizations;
}

export async function findRegistrationLocalization({
  tenantId,
  locale,
}: {
  locale?: string;
  tenantId: Tenant['id'];
}) {
  const availableLocalization = await findLocalizations({tenantId});

  const language = locale && findLocaleLanguage(inverseTransformLocale(locale));
  const fallbackLanguages = [locale, language, DEFAULT_LOCALE];

  const localization =
    fallbackLanguages
      .map(lang =>
        availableLocalization.find(l => lang && l.code?.startsWith(lang)),
      )
      .find(Boolean) || availableLocalization?.[0];

  return localization;
}
