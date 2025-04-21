export const HEADING = 'You have quotations awaiting for reponse.';

export const QUOTATION_STATUS = {
  DRAFT_QUOTATION: 1,
  FINALISED_QUOTATION: 2,
  CONFIRMED: 3,
  COMPLETED: 4,
  CANCELED_QUOTATION: 5,
};

export const QUOTATION_TYPE = {
  DRAFT: 'Draft quotation',
  FINALISED: 'Finalized quotation',
  CANCELED: 'Cancelled',
  UNKNOWN: 'Unknown',
};

export const PRODUCT_COLUMNS = [
  {key: 'productName', label: 'Product Name'},
  {key: 'qty', label: 'Quantity', align: 'right'},
  {key: 'unit', label: 'Unit'},
  {key: 'price', label: 'Unit Price Wt', align: 'right'},
  {key: 'exTaxTotal', label: 'Total Wt', align: 'right'},
  {key: 'tax', label: 'Tax', align: 'right'},
  {key: 'discountAmount', label: 'Discount', align: 'right'},
  {key: 'inTaxTotal', label: 'Total ATI', align: 'right'},
];

export const PRODUCT_CARD_COLUMNS = [
  {key: 'productName', label: 'Product number'},
  {key: 'qty', label: 'Quantity'},
  {key: 'inTaxTotal', label: 'Total ATI'},
  {key: 'dropdown', label: ''},
];

export const SECONDS = 'a few seconds';
export const MINUTES = 'minutes';
export const HOURS = 'hours';
export const DAYS = 'days';
