'use server';

import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {findWorkspace} from '@/orm/workspace';
import {getSession} from '@/auth';
import {t} from '@/locale/server';
import {manager, type Tenant} from '@/tenant';
import {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {findEvent} from '@/subapps/events/common/orm/event';
import {findEventRegistration} from '@/subapps/events/common/orm/registration';
import {error} from '@/subapps/events/common/utils';

export async function createInvoice({
  workspaceURL,
  tenantId,
  registrationId,
  eventId,
}: {
  workspaceURL: string;
  tenantId: Tenant['id'];
  registrationId: ID;
  eventId: ID;
}) {
  if (!registrationId) {
    return error(await t('Event registration ID is required.'));
  }

  const tenant = await manager.getTenant(tenantId);
  const aos = tenant?.config?.aos;

  if (!aos?.url) {
    return error(await t('Invoice creation failed. Webservice not available.'));
  }

  const ws = `${aos.url}/ws/portal/invoice/eventInvoice`;

  try {
    const session = await getSession();
    const user = session?.user;

    const workspace = await findWorkspace({url: workspaceURL, user, tenantId});

    if (!workspace) {
      return error(await t('Invalid workspace.'));
    }

    const event = await findEvent({id: eventId, workspace, tenantId, user});

    if (!event) {
      return error(await t('Event not found.'));
    }

    const eventRegistration = await findEventRegistration({
      workspaceURL,
      tenantId,
      id: registrationId,
      eventId: event.id,
    });

    if (!eventRegistration) {
      return error(await t('Event registration not found.'));
    }

    const payload = {
      partnerWorkspaceId: workspace.id,
      registrationId: eventRegistration.id,
    };

    const {data} = await axios.post(ws, payload, {
      auth: {
        username: aos.auth.username,
        password: aos.auth.password,
      },
    });

    if (data?.status === -1) {
      return error(
        await t(
          data?.message ||
            'Unable to create the invoice. Please try again later.',
        ),
      );
    }

    return data;
  } catch (err) {
    console.error('Invoice creation failed:', err);
    return error(
      await t(
        'An error occurred while processing your invoice. Please try again later.',
      ),
    );
  }
}
