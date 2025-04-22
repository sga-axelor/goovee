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
  variant: 'success' | 'purple' | 'yellow' | 'primary' | 'default';
} {
  if (statusSelect === ORDER_STATUS.CONFIRMED) {
    if (deliveryState === ORDER_DELIVERY_STATUS.DELIVERED) {
      return {
        status: ORDER_TYPE.DELIVERED,
        variant: 'primary',
      };
    }
    return {
      status: ORDER_TYPE.CONFIRMED,
      variant: 'yellow',
    };
  } else if (statusSelect === ORDER_STATUS.CLOSED) {
    return {
      status: ORDER_TYPE.CLOSED,
      variant: 'success',
    };
  } else {
    return {
      status: ORDER_TYPE.UNKNOWN,
      variant: 'default',
    };
  }
}
