'use server';

import {headers} from 'next/headers';

// ---- CORE IMPORTS ---- //
import {getTranslation} from '@/i18n/server';
import {getSession} from '@/auth';
import {TENANT_HEADER} from '@/middleware';
import {findContactWorkspaces, findPartnerWorkspaces} from '@/orm/workspace';

// ---- CORE IMPORTS ---- //
import {findLocalizations} from '../common/orm/languages';
import {findPartnerByEmail, updatePartner} from '@/orm/partner';

function error(message: string) {
  return {
    error: true,
    message,
  };
}

export async function updatePreference({
  defaultWorkspace,
  localization,
}: {
  defaultWorkspace: string;
  localization: string;
}) {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await 'Bad request');
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  try {
    const partner = await findPartnerByEmail(user.email, tenantId);

    if (!partner) {
      return error(await getTranslation('Invalid partner'));
    }

    if (localization) {
      const availableLocalization = await findLocalizations({
        tenantId,
      });

      const isValidLocalization = availableLocalization.find(
        l => Number(l.id) === Number(localization),
      );

      if (!isValidLocalization) {
        return error(await getTranslation('Invalid localization'));
      }
    }

    let partnerWorkspace: any;

    if (defaultWorkspace) {
      partnerWorkspace = partner?.partnerWorkspaceSet?.find(
        (ws: any) =>
          ws?.workspace?.id &&
          Number(ws.workspace.id) === Number(defaultWorkspace),
      );

      if (!partnerWorkspace) {
        return error(await getTranslation('Invalid default workspace'));
      }
    }

    const updatedPartner = await updatePartner({
      data: {
        id: partner.id,
        version: partner.version,
        defaultWorkspace: defaultWorkspace
          ? {select: {id: partnerWorkspace?.id}}
          : null,
        localization: localization ? {select: {id: localization}} : null,
      },
      tenantId,
    });

    if (!updatedPartner?.id) {
      return error(
        await getTranslation('Error updating preferences. Try again.'),
      );
    }

    return {
      success: true,
      data: updatedPartner,
    };
  } catch (err) {
    return error(
      await getTranslation('Error updating preferences. Try again.'),
    );
  }
}

export async function fetchPreference() {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await 'Bad request');
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  try {
    const partner = await findPartnerByEmail(user.email, tenantId);

    return {
      success: true,
      data: {
        defaultWorkspace: partner?.defaultWorkspace?.workspace?.id,
        localization: partner?.localization?.id,
      },
    };
  } catch (err) {
    return error(await getTranslation('Error getting workspaces. Try again.'));
  }
}

export async function fetchWorkspaces() {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await 'Bad request');
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  try {
    const workspaces = user.isContact
      ? await findContactWorkspaces({
          contactId: user.id,
          partnerId: user.mainPartnerId!,
          tenantId,
        })
      : await findPartnerWorkspaces({
          partnerId: user.id,
          tenantId,
        });

    return {
      success: true,
      data: workspaces,
    };
  } catch (err) {
    return error(await getTranslation('Error getting workspaces. Try again.'));
  }
}

export async function fetchLocalizations() {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) {
    return error(await 'Bad request');
  }

  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return error(await getTranslation('Unauthorized'));
  }

  try {
    const localizations = await findLocalizations({
      tenantId,
    });
    return {
      success: true,
      data: localizations,
    };
  } catch (err) {
    return error(
      await getTranslation('Error getting localizations. Try again.'),
    );
  }
}
