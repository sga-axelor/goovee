// ---- CORE IMPORTS ---- //
import {i18n} from '@/locale';

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
export const DEFAULT_PAGE = 1;
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
  TOTAL: 'total',
  RESTRICTED: 'restricted',
};

/**
 * SUBAPP CODES
 */
export enum SUBAPP_CODES {
  shop = 'shop',
  quotations = 'quotations',
  orders = 'orders',
  invoices = 'invoices',
  resources = 'resources',
  news = 'news',
  events = 'events',
  forum = 'forum',
  ticketing = 'ticketing',
  chat = 'chat',
}

/**
 * SUBAPP WITH ROLES
 */
export const SUBAPP_WITH_ROLES = [
  SUBAPP_CODES.quotations,
  SUBAPP_CODES.orders,
  SUBAPP_CODES.invoices,
  SUBAPP_CODES.ticketing,
];

/**
 * SUBAPP PAGE
 */
export const SUBAPP_PAGE = {
  orders: '/ongoing',
  archived: '/archived',
  invoices: '/unpaid',
  checkout: `${SUBAPP_CODES.shop}/cart/checkout`,
  addresses: 'addresses',
  create: 'create',
  edit: 'edit',
  account: 'account',
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
  full_date: 'MMMM Do YYYY',
  DD_MM_YYYY: 'DD-MM-YYYY',
  MM_YYYY: 'MM-YYYY',
  YYYY: 'YYYY',
  hours_12_hour: 'hA',
};

/**
 * BANNER
 */

export const BANNER_TITLES = {
  resources: 'Resources',
  news: 'News',
  events: 'Events',
  forum: 'Forum',
};
export const BANNER_DESCRIPTION =
  'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam';

export const IMAGE_URL = `url("/images/hero-bg.svg")`;

/**
 * OTHERS
 */
export const NO_RESULTS_FOUND = 'No results found.';
export const DAY = 'day';
export const MONTH = 'month';
export const YEAR = 'year';

/**
 * URL
 */
export const URL_PARAMS = {
  page: 'page',
  sort: 'sort',
  search: 'search',
  searchid: 'searchid',
  category: 'category',
  date: 'date',
  query: 'query',
};

/**
 * NAVIGATION
 */
export const NAVIGATION = {
  top: 'topSide',
  left: 'leftSide',
};

/**
 * SEARCH PARAMS
 */

export const SEARCH_PARAMS = {
  TENANT_ID: 'tenant',
};

/**
 * COMMENT
 */
export const DEFAULT_COMMENTS_LIMIT = 3;
export const COMMENT_TRACKING = 'User created a comment';
export const MAIL_MESSAGE_TYPE = 'notification';
export const COMMENT = 'Comment';
export const COMMENTS = 'Comments';
export const DISABLED_COMMENT_PLACEHOLDER =
  'You need to log in to comment posts';
export const SORT_TYPE = {
  new: 'new',
  old: 'old',
  popular: 'popular',
};

export const REPORT = 'Report';
export const NOT_INTERESTED = 'Not interested';
export const SORT_BY_OPTIONS = [
  {
    id: 1,
    key: SORT_TYPE.new,
    label: i18n.t('New'),
  },
  {
    id: 2,
    key: SORT_TYPE.old,
    label: i18n.t('Old'),
  },
  {
    id: 3,
    key: SORT_TYPE.popular,
    label: i18n.t('Popular'),
  },
];

/**
 * REGISTRATION
 */

export const USER_CREATED_FROM = 'portal';

export const ALLOW_NO_REGISTRATION = 'no';
export const ALLOW_ALL_REGISTRATION = 'yesForAll';
export const ALLOW_AOS_ONLY_REGISTRATION = 'yesForAOS';

/**
 * RESPONSIVE SIZES
 */

export const RESPONSIVE_SIZES = ['xs', 'sm', 'md'] as const;

/**
 * Address
 */
export enum ADDRESS_TYPE {
  invoicing = 'invoicing',
  delivery = 'delivery',
}

/**
 * OUT OF STOCK
 */
export const OUT_OF_STOCK_TYPE = {
  ALLOW_BUY_WITH_NO_MESSAGE: 1,
  ALLOW_BUY_WITH_MESSAGE: 2,
  HIDE_PRODUCT_CANNOT_BUY: 3,
  DONT_ALLOW_BUY_WITH_MESSAGE: 4,
};

/**
 * KEY_TYPES
 */
export const KEY = {
  enter: 'Enter',
};
