// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

export const ITEMS = [
  {
    id: '1',
    title: i18n.t('Ongoing orders'),
    href: 'ongoing',
  },
  {
    id: '2',
    title: i18n.t('Archived orders'),
    href: 'archived',
  },
];

export const PRODUCT_COLUMNS = [
  {key: 'productName', label: i18n.t('Product number')},
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

export const ORDER_TYPE = {
  CONFIRMED: i18n.t('Confirmed'),
  SHIPPED: i18n.t('Shipped'),
  DELIVERED: i18n.t('Delivered'),
  CLOSED: i18n.t('Closed'),
  UNKNOWN: i18n.t('Unknown'),
};

export const ORDER_STATUS = {
  CONFIRMED: 3,
  CLOSED: 4,
};

export const ORDER_DELIVERY_STATUS = {
  DELIVERED: 3,
};

export const RELATED_MODELS = {
  SALE_ORDER_MODEL: 'com.axelor.apps.sale.db.SaleOrder',
};
