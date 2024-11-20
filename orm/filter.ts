import {manager, type Tenant} from '@/tenant';
import {type User} from '@/types';
import {findPartnerByEmail} from './partner';

export const filterPrivate = async (
  {user, tenantId}: {user?: User; tenantId: Tenant['id']} = {
    tenantId: '',
  },
  config: {
    privateOnly?: boolean;
  } = {},
) => {
  if (!tenantId) {
    throw new Error('TenantId is required.');
  }

  const client = await manager.getClient(tenantId);

  if (!client) {
    throw new Error('Invalid tenant provided.');
  }

  if (!user) {
    return {
      isPrivate: false,
    };
  }

  const partner = await findPartnerByEmail(user.email, tenantId);

  if (!partner) {
    throw new Error('Unauthorized');
  }

  const partnerCategory = partner?.partnerCategory;

  const OR = [];

  if (!config?.privateOnly) {
    OR.push({isPrivate: false});
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
          partnerCategory
            ? {
                partnerCategorySet: {
                  id: {
                    in: [partnerCategory.id],
                  },
                },
              }
            : {},
        ],
      },
    ],
  });

  return {
    OR,
  };
};
