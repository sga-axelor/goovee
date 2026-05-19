// ---- LOCAL IMPORTS ---- //
import {
  QUOTATION_STATUS,
  QUOTATION_TYPE,
} from '@/subapps/quotations/common/constants/quotations';

type Variant = 'blue' | 'yellow' | 'destructive' | 'default';

export function getStatus(statusSelect: number | string): {
  status: string;
  variant: Variant;
} {
  let status: string;
  let variant: Variant;

  switch (statusSelect) {
    case QUOTATION_STATUS.DRAFT_QUOTATION:
      status = QUOTATION_TYPE.DRAFT;
      variant = 'blue';
      break;
    case QUOTATION_STATUS.FINALISED_QUOTATION:
      status = QUOTATION_TYPE.FINALISED;
      variant = 'yellow';
      break;
    case QUOTATION_STATUS.CANCELED_QUOTATION:
      status = QUOTATION_TYPE.CANCELED;
      variant = 'destructive';
      break;
    default:
      status = QUOTATION_TYPE.UNKNOWN;
      variant = 'default';
  }

  return {status, variant};
}
