// ---- CORE IMPORTS ---- //
import {getClient} from '@/goovee';
import {i18n} from '@/lib/i18n';
import {SUBAPP_CODES} from '@/constants';

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
}: {
  search: string;
  workspaceURL: string;
}) {
  if (!search) return error(i18n.get('Search value is missing.'));

  const response = await validate([
    withWorkspace(workspaceURL, {checkAuth: true}),
    withSubapp(SUBAPP_CODES.events, workspaceURL),
  ]);

  if (response.error) {
    return response;
  }

  const c = await getClient();

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
