/**
 * CURRENCY
 */
export const DEFAULT_CURRENCY_SYMBOL = '€';
export const DEFAULT_CURRENCY_CODE = 'EUR';

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
export const ORDER_BY = {
  ASC: 'ASC' as const,
  DESC: 'DESC' as const,
};

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
 * SUBAPP CODES
 */
export const SUBAPP_CODES = {
  shop: 'shop',
  quotations: 'quotations',
  orders: 'orders',
  invoices: 'invoices',
  resources: 'resources',
  news: 'news',
  events: 'events',
};

/**
 * SUBAPP PAGE
 */
export const SUBAPP_PAGE = {
  orders: '/ongoing',
  invoices: '/unpaid',
  checkout: `${SUBAPP_CODES.shop}/cart/checkout`,
};

/**
 * DATE FORMATS
 */
export const DATE_FORMATS = {
  timestamp_with_seconds: 'YYYY-MM-DD HH:mm:ss',
  timestamp_with_microseconds: 'YYYY-MM-DD HH:mm:ss.SSSSSS',
  iso_8601_utc_timestamp: 'YYYY-MM-DDTHH:mm[Z]',
  us_date: 'MM/DD/YYYY',
  full_month_day_year_12_hour: 'MMMM D YYYY - hA',
  custom: 'MMMM D YYYY - h:mm A',
};

/**
 * BANNER
 */

export const BANNER_TITLES = {
  resources: 'Resources',
  news: 'News',
  events: 'Events',
};
export const BANNER_DESCRIPTION =
  'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam';

export const IMAGE_URL = `url("/images/hero-bg.svg")`;

/**
 * OTHERS
 */
export const NO_RESULTS_FOUND = 'No results found.';

/**
 * URL
 */
export const URL_PARAMS = {
  page: 'page',
};

/**
 * NAVIGATION
 */
export const NAVIGATION = {
  top: 'topSide',
  left: 'leftSide',
};

/**
 * COMMENT
 */
export const COMMENT_TRACKING = 'User created a comment';
