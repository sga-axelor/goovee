// ---- CORE IMPORTS ---- //
import { ROLE } from "@/constants";

// ---- LOCAL IMPORTS ---- //
import {
  INVOICE_TYPE,
  INVOICE_STATUS,
} from "@/subapps/invoices/common/constants/invoices";

export function getStatus(value: string | number): {
  status: string;
  variant: "success" | "error";
} {
  if (Number(value) !== INVOICE_STATUS.UNPAID) {
    return {
      status: INVOICE_TYPE.UNPAID,
      variant: "error",
    };
  } else {
    return {
      status: INVOICE_TYPE.PAID,
      variant: "success",
    };
  }
}

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
        partner: {
          id: mainPartnerId || "",
        },
      };
    } else if (role === ROLE.RESTRICTED) {
      where = {
        partner: {
          id: id || "",
        },
      };
    }
  } else {
    where = {
      partner: {
        id: id || "",
      },
    };
  }

  return where;
}
