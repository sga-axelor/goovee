// ---- CORE IMPORTS ---- //
import {ROLE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  DAYS,
  HOURS,
  MINUTES,
  QUOTATION_STATUS,
  QUOTATION_TYPE,
  SECONDS,
} from '@/subapps/quotations/common/constants/quotations';
import type {User} from '@/types';

type Variant = 'blue' | 'yellow' | 'destructive' | 'default';

export function getStatus(statusSelect: number | string): {
  status: string | number;
  variant: Variant;
} {
  let status: string | number;
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

export const updateDocument = (date1: any, date2: any) => {
  let update;
  let diffInDays = Math.round(date1.diff(date2, DAYS, true));
  let diffInHours = date1.diff(date2, HOURS);
  let diffInMins = Math.round(date1.diff(date2, MINUTES, true));

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      update = diffInMins === 0 ? SECONDS : `${diffInMins} ${MINUTES}`;
    } else {
      update = `${diffInHours} ${HOURS}`;
    }
  } else {
    update = `${Math.round(diffInDays)} ${DAYS}`;
  }

  return update;
};

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
