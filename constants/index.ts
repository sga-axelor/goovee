/**
 * CURRENCY
 */
export const DEFAULT_CURRENCY_SYMBOL = '€';

/**
 * SCALE
 */
export const DEFAULT_SCALE = 2;
export const DEFAULT_UNIT_PRICE_SCALE = 2;
export const DEFAULT_CURRENCY_SCALE = 2;

/**
 * TAX
 */
export const DEFAULT_TAX_VALUE = 0;

/**
 * LOCAL STORAGE
 */
export const PREFIX_CART_KEY = 'ct';

/**
 * QUERY
 */
export const DEFAULT_LIMIT = 12;

/**
 * TENANT
 */
export const DEFAULT_TENANT = 'd';

/**
 * WORKSPACE
 */
export const DEFAULT_WORKSPACE = 'w';
export const DEFAULT_WORKSPACE_URI = `/${DEFAULT_TENANT}/${DEFAULT_WORKSPACE}`;
export const DEFAULT_WORKSPACE_URL = `${process.env.NEXT_PUBLIC_HOST}${DEFAULT_WORKSPACE_URI}`;

/**
 * CUSTOMER ROLE
 */
export const ROLE = {
  TOTAL: 'Total',
  RESTRICTED: 'restricted',
};

/**
 * SUBAPP PAGE
 */
export const SUBAPP_PAGE = {
  orders: '/ongoing',
  invoices: '/unpaid',
};

/**
 * SUBAPP CODES
 */
export const SUBAPP_CODES = {
  shop: 'shop',
  quotations: 'quotations',
  orders: 'orders',
  invoices: 'invoices',
  resources: 'resources',
};
