import {manager, type Tenant} from '@/tenant';
import {findPartnerByEmail} from './partner';
import type {User} from '@/types';

const openRecordFilters = [
  {
    isPrivate: null,
  },
  {
    isPrivate: false,
  },
];

export const filterPrivate = async (
  {user, tenantId}: {user?: User; tenantId: Tenant['id']} = {
    tenantId: '',
  },
  config: {
    privateOnly?: boolean;
  } = {},
) => {
  const defaultFilter = {
    OR: openRecordFilters,
  };

  if (!tenantId) {
    console.error('TenantId is required.');
    return defaultFilter;
  }

  let client;
  try {
    client = await manager.getClient(tenantId);
  } catch (err) {
    console.log(err);
  }

  if (!client) {
    console.error('Client is required.');
    return defaultFilter;
  }

  if (!user) {
    console.error('User is required');
    return defaultFilter;
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    console.error('Unauthorized');
    return defaultFilter;
  }

  const partnerCategory = partner?.partnerCategory;

  let OR: any[] = [];

  if (!config?.privateOnly) {
    OR = [...openRecordFilters];
  }

  OR.push({
    AND: [
      {
        isPrivate: true,
      },
      {
        OR: [
          {
            partnerSet: {
              id: {
                in: [partner.id],
              },
            },
          },
          ...(partnerCategory
            ? [
                {
                  partnerCategorySet: {
                    id: {
                      in: [partnerCategory.id],
                    },
                  },
                },
              ]
            : []),
        ],
      },
    ],
  });

  return {
    OR,
  };
};
