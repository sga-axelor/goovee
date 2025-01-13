// ---- CORE IMPORTS ---- //

const HEADING = 'You have unpaid invoices arriving soon to their limit date.';

const ITEMS = [
  {
    id: '1',
    title: 'Unpaid invoices',
    href: 'unpaid',
  },
  {
    id: '2',
    title: 'Archived invoices',
    href: 'archived',
  },
];

const INVOICE_COLUMNS = ['Description', 'Rate', 'Qty', 'Amount'];

const INVOICE_TYPE = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
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
