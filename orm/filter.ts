import {type Tenant} from '@/tenant';
import {findPartnerById} from './partner';
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

  if (!(tenantId && user)) {
    return defaultFilter;
  }

  const partnerId = user?.isContact ? user.mainPartnerId : user.id;

  if (!partnerId) {
    return defaultFilter;
  }

  const partner = await findPartnerById(partnerId, tenantId);

  if (!partner) {
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
