import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {t} from '@/locale/server';
import {findWorkspace} from '@/orm/workspace';
import {manager, type Tenant} from '@/tenant';
import {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {error} from '@/subapps/events/common/utils';

export async function createInvoice({
  workspaceURL,
  tenantId,
  registrationId,
  currencyCode,
}: {
  workspaceURL: string;
  tenantId: Tenant['id'];
  registrationId: ID;
  currencyCode: string;
}) {
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

    const partnerWorkspaceId = workspace?.workspacePermissionConfig?.id;
    if (!partnerWorkspaceId) {
      return error(await t('Partner workspace id is missing.'));
    }

    const payload = {
      currencyCode,
      partnerWorkspaceId,
      registrationId,
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
