// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';

const HEADING = i18n.get(
  'You have unpaid invoices arriving soon to their limit date.',
);

const ITEMS = [
  {
    id: '1',
    title: i18n.get('Unpaid invoices'),
    href: 'unpaid',
  },
  {
    id: '2',
    title: i18n.get('Archived invoices'),
    href: 'archived',
  },
];

const INVOICE_COLUMNS = [
  i18n.get('Description'),
  i18n.get('Rate'),
  i18n.get('Qty'),
  i18n.get('Amount'),
];
const INVOICE_TYPE = {
  UNPAID: i18n.get('Unpaid'),
  PAID: i18n.get('Paid'),
};

const INVOICE = {
  ARCHIVED: 'archived',
  UNPAID: 'unpaid',
};

const INVOICE_CATEGORY = {
  SALE_INVOICE: 3,
};

const INVOICE_STATUS = {
  VENTILATED: 3,
  UNPAID: 0,
};
const UNABLE_TO_FIND_INVOICE = 'Unable to load file';

export {
  HEADING,
  ITEMS,
  INVOICE_COLUMNS,
  INVOICE_TYPE,
  INVOICE_STATUS,
  INVOICE_CATEGORY,
  INVOICE,
  UNABLE_TO_FIND_INVOICE,
};
