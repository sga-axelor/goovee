// ---- CORE IMPORTS ---- //
import {ROLE} from '@/constants';

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

export function getWhereClause(
  isContact: boolean | undefined,
  role: any = ROLE.RESTRICTED,
  id: string | number | undefined,
  mainPartnerId: string | number | undefined,
) {
  let where;

  if (isContact) {
    if (role === ROLE.TOTAL) {
      where = {
        clientPartner: {id: mainPartnerId},
      };
    } else {
      where = {
        contactPartner: {id},
      };
    }
  } else {
    where = {
      clientPartner: {id},
    };
  }

  return where;
}
