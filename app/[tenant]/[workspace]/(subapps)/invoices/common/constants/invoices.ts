// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

const HEADING = i18n.t(
  'You have unpaid invoices arriving soon to their limit date.',
);

const ITEMS = [
  {
    id: '1',
    title: i18n.t('Unpaid invoices'),
    href: 'unpaid',
  },
  {
    id: '2',
    title: i18n.t('Archived invoices'),
    href: 'archived',
  },
];

const INVOICE_COLUMNS = [
  i18n.t('Description'),
  i18n.t('Rate'),
  i18n.t('Qty'),
  i18n.t('Amount'),
];
const INVOICE_TYPE = {
  UNPAID: i18n.t('Unpaid'),
  PAID: i18n.t('Paid'),
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
