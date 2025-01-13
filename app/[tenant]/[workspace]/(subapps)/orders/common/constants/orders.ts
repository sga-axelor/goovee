export const ITEMS = [
  {
    id: '1',
    title: 'Ongoing orders',
    href: 'ongoing',
  },
  {
    id: '2',
    title: 'Archived orders',
    href: 'archived',
  },
];

export const PRODUCT_COLUMNS = [
  {key: 'productName', label: 'Product number'},
  {key: 'qty', label: 'Quantity'},
  {key: 'unit', label: 'Unit'},
  {key: 'price', label: 'Unit Price Wt'},
  {key: 'exTaxTotal', label: 'Total Wt'},
  {key: 'tax', label: 'Tax'},
  {key: 'discountAmount', label: 'Discount'},
  {key: 'inTaxTotal', label: 'Total ATI'},
];

export const PRODUCT_CARD_COLUMNS = [
  {key: 'productName', label: 'Product number'},
  {key: 'qty', label: 'Quantity'},
  {key: 'inTaxTotal', label: 'Total ATI'},
  {key: 'dropdown', label: ''},
];

export const ORDER_TYPE = {
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CLOSED: 'Closed',
  UNKNOWN: 'Unknown',
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
