// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/i18n';
import {SUBAPP_CODES} from '@/constants';
import type {ID} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  validate,
  withSubapp,
  withWorkspace,
} from '@/subapps/events/common/actions/validation';
import {error} from '@/subapps/events/common/utils';

export async function findContact({
  search,
  workspaceURL,
  tenantId,
}: {
  search: string;
  workspaceURL: string;
  tenantId: ID;
}) {
  if (!(search && tenantId)) return error(i18n.get('Search value is missing.'));

  const response = await validate([
    withWorkspace(workspaceURL, tenantId, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL, tenantId),
  ]);

  if (response.error) {
    return response;
  }

  const c = await getClient(tenantId);

  const result = await c.aOSPartner.find({
    where: {
      AND: [
        {
          simpleFullName: {
            like: `%${search.toLowerCase()}%`,
          },
        },
        {
          isContact: {
            eq: true,
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      firstName: true,
      simpleFullName: true,
      emailAddress: true,
      fixedPhone: true,
      mainPartner: true,
    },
  });

  return result;
}
