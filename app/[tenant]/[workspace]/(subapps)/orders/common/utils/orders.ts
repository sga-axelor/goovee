// ---- CORE IMPORTS ---- //
import {ROLE} from '@/constants';
import type {User} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {
  ORDER_DELIVERY_STATUS,
  ORDER_STATUS,
  ORDER_TYPE,
} from '@/subapps/orders/common/constants/orders';

export function getStatus(
  statusSelect: number,
  deliveryState: number,
): {
  status: string;
  variant: 'success' | 'purple' | 'yellow' | 'default';
} {
  if (statusSelect === ORDER_STATUS.CONFIRMED) {
    return {
      status: ORDER_TYPE.CONFIRMED,
      variant: 'yellow',
    };
  } else if (statusSelect === ORDER_STATUS.CONFIRMED) {
    return {
      status: ORDER_TYPE.CLOSED,
      variant: 'success',
    };
  } else if (deliveryState === ORDER_DELIVERY_STATUS.DELIVERED) {
    return {
      status: ORDER_TYPE.DELIVERED,
      variant: 'purple',
    };
  } else {
    return {
      status: ORDER_TYPE.UNKNOWN,
      variant: 'default',
    };
  }
}

export function getWhereClause({
  user,
  role,
  isContactAdmin,
}: {
  user: User;
  role: any;
  isContactAdmin?: boolean;
}) {
  if (!user) return {};

  const {id, mainPartnerId, isContact} = user;

  let where: any = {
    clientPartner: {
      id: isContact ? mainPartnerId : id,
    },
  };

  if (isContact) {
    where.contactPartner = {
      id,
    };
  }

  if (isContactAdmin || role === ROLE.TOTAL) {
    delete where.contactPartner;
  }

  return where;
}
