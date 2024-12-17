// ---- CORE IMPORTS ---- //
import {ROLE} from '@/constants';

// ---- LOCAL IMPORTS ---- //
import {
  INVOICE_TYPE,
  INVOICE_STATUS,
} from '@/subapps/invoices/common/constants/invoices';
import {User} from '@/types';

export function getStatus(value: string | number): {
  status: string;
  variant: 'success' | 'destructive';
} {
  if (Number(value) !== INVOICE_STATUS.UNPAID) {
    return {
      status: INVOICE_TYPE.UNPAID,
      variant: 'destructive',
    };
  } else {
    return {
      status: INVOICE_TYPE.PAID,
      variant: 'success',
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
    partner: {
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
