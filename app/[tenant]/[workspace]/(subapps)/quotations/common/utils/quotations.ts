// ---- CORE IMPORTS ---- //
import { ROLE } from "@/constants";

// ---- LOCAL IMPORTS ---- //
import {
  DAYS,
  HOURS,
  MINUTES,
  QUOTATION_STATUS,
  QUOTATION_TYPE,
  SECONDS,
} from "@/subapps/quotations/common/constants/quotations";

export function getStatus(statusSelect: number | string): {
  status: string | number;
  variant: "secondary" | "warning" | "error" | "default";
} {
  let status: string | number;
  let variant: "secondary" | "warning" | "error" | "default";

  switch (statusSelect) {
    case QUOTATION_STATUS.DRAFT_QUOTATION:
      status = QUOTATION_TYPE.DRAFT;
      variant = "secondary";
      break;
    case QUOTATION_STATUS.FINALISED_QUOTATION:
      status = QUOTATION_TYPE.FINALISED;
      variant = "warning";
      break;
    case QUOTATION_STATUS.CANCELED_QUOTATION:
      status = QUOTATION_TYPE.CANCELED;
      variant = "error";
      break;
    default:
      status = QUOTATION_TYPE.UNKNOWN;
      variant = "default";
  }

  return { status, variant };
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

export function getWhereClause(
  isContact: boolean | undefined,
  role: any,
  mainPartnerId: string | number | undefined,
  id: string | number | undefined
) {
  let where;

  if (isContact) {
    if (role === ROLE.TOTAL) {
      where = {
        clientPartner: { id: mainPartnerId },
      };
    } else {
      where = {
        contactPartner: { id },
      };
    }
  } else {
    where = {
      clientPartner: { id },
    };
  }

  return where;
}
