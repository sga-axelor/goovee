import {i18n} from '@/locale';

export const HEADING = i18n.t('You have quotations awaiting for reponse.');

export const QUOTATION_STATUS = {
  DRAFT_QUOTATION: 1,
  FINALISED_QUOTATION: 2,
  CONFIRMED: 3,
  COMPLETED: 4,
  CANCELED_QUOTATION: 5,
};

export const QUOTATION_TYPE = {
  DRAFT: i18n.t('Draft quotation'),
  FINALISED: i18n.t('Finalized quotation'),
  CANCELED: i18n.t('Cancelled'),
  UNKNOWN: i18n.t('Unknown'),
};

export const PRODUCT_COLUMNS = [
  {key: 'productName', label: i18n.t('Product Name')},
  {key: 'qty', label: i18n.t('Quantity')},
  {key: 'unit', label: i18n.t('Unit')},
  {key: 'price', label: i18n.t('Unit Price Wt')},
  {key: 'exTaxTotal', label: i18n.t('Totoal Wt')},
  {key: 'tax', label: i18n.t('Tax')},
  {key: 'discountAmount', label: i18n.t('Discount')},
  {key: 'inTaxTotal', label: i18n.t('Total ATI')},
];
//
export const PRODUCT_CARD_COLUMNS = [
  {key: 'productName', label: i18n.t('Product number')},
  {key: 'qty', label: i18n.t('Quantity')},
  {key: 'inTaxTotal', label: i18n.t('Total ATI')},
  {key: 'dropdown', label: ''},
];

export const SECONDS = i18n.t('a few seconds');
export const MINUTES = i18n.t('minutes');
export const HOURS = i18n.t('hours');
export const DAYS = i18n.t('days');
