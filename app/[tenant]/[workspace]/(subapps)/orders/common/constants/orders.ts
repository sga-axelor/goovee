// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';

export const ORDERS_COLUMNS = [
  {key: 'saleOrderSeq', label: i18n.get('Order number')},
  {key: 'statusSelect', label: i18n.get('Status')},
  {key: 'createdOn', label: i18n.get('Created on')},
  {key: 'exTaxTotal', label: i18n.get('Total WT')},
  {key: 'inTaxTotal', label: i18n.get('Total ATI')},
];

export const ITEMS = [
  {
    id: '1',
    title: i18n.get('Ongoing orders'),
    href: 'ongoing',
  },
  {
    id: '2',
    title: i18n.get('Archived orders'),
    href: 'archived',
  },
];

export const PRODUCT_COLUMNS = [
  {key: 'productName', label: i18n.get('Product number')},
  {key: 'qty', label: i18n.get('Quantity')},
  {key: 'unit', label: i18n.get('Unit')},
  {key: 'price', label: i18n.get('Unit Price Wt')},
  {key: 'exTaxTotal', label: i18n.get('Totoal Wt')},
  {key: 'tax', label: i18n.get('Tax')},
  {key: 'discountAmount', label: i18n.get('Discount')},
  {key: 'inTaxTotal', label: i18n.get('Total ATI')},
];
//
export const PRODUCT_CARD_COLUMNS = [
  {key: 'productName', label: i18n.get('Product number')},
  {key: 'qty', label: i18n.get('Quantity')},
  {key: 'inTaxTotal', label: i18n.get('Total ATI')},
  {key: 'dropdown', label: ''},
];

export const ORDER_TYPE = {
  CONFIRMED: i18n.get('Confirmed'),
  SHIPPED: i18n.get('Shipped'),
  DELIVERED: i18n.get('Delivered'),
  CLOSED: i18n.get('Closed'),
  UNKNOWN: i18n.get('Unknown'),
};

export const ORDER_STATUS = {
  CONFIRMED: 3,
  CLOSED: 4,
};

export const ORDER_DELIVERY_STATUS = {
  DELIVERED: 3,
};
