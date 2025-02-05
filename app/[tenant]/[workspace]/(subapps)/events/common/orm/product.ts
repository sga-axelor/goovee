import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {manager, type Tenant} from '@/tenant';
import {findWorkspace} from '@/orm/workspace';
import {t} from '@/locale/server';
import {getSession} from '@/auth';

export async function findProductsFromWS({
  workspaceURL,
  tenantId,
  eventId,
}: {
  workspaceURL: string;
  eventId: string | number;
  tenantId: Tenant['id'];
}) {
  if (!workspaceURL && eventId && tenantId) {
    return null;
  }
  const tenant = await manager.getTenant(tenantId);

  if (!tenant?.config?.aos?.url) {
    return [];
  }

  const session = await getSession();
  const user = session?.user;

  const workspace = await findWorkspace({
    url: workspaceURL,
    user,
    tenantId,
  });

  if (!workspace) {
    return {
      error: true,
      message: await t('Invalid workspace'),
    };
  }
  const {aos} = tenant.config;

  const ws = `${aos.url}/ws/portal/event/price`;

  const partnerId = user?.id;

  try {
    const reqBody = {
      eventId,
      partnerWorkspaceId: workspace.id,
      partnerId,
    };
    const res = await axios
      .post(ws, reqBody, {
        auth: {
          username: aos.auth.username,
          password: aos.auth.password,
        },
      })
      .then(({data}) => data);

    if (res?.data?.status === -1) {
      return null;
    }

    return res?.data || null;
  } catch (err) {
    console.log('Error:', err);
    return null;
  }
}
