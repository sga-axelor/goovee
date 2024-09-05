import {Theme} from '@/types/theme';

export type ID = string | number;
export type Version = number;

export interface Model {
  id: ID;
  version: Version;
}

export type User = {
  id: ID;
  name: string;
  email: string;
  isContact?: boolean;
  mainPartnerId?: string;
};

export interface PortalWorkspace extends Model {
  url: string;
  theme?: Theme;
  config?: PortalAppConfig;
  apps?: PortalApp[];
}

export interface PortalAppConfig extends Model {
  name: string;
  allowOnlinePaymentForEcommerce: boolean;
  allowOnlinePaymentForInvoices: boolean;
  byAToZ: boolean;
  byZToA: boolean;
  byFeature: boolean;
  byLessExpensive: boolean;
  byMostExpensive: boolean;
  byNewest: boolean;
  company: Company;
  confirmOrder: boolean;
  displayOutOfStock: boolean;
  displayPrices: boolean;
  displayTwoPrices: string;
  mainPrice: string;
  eSignature: boolean;
  payInAdvance: boolean;
  priceAfterLogin: string;
  requestQuotation: boolean;
  paymentOptionSet?: Array<{}>;
  carouselList?: Array<{
    title?: string;
    subTitle?: string;
    href?: string;
    image?: {id: ID};
    buttonLabel?: string;
  }>;
  canConfirmQuotation?: boolean;
  payQuotationToConfirm?: boolean;
  canPayInvoice?: 'no' | 'total' | 'partial';
}

export interface PortalApp extends Model {
  name: string;
  code: string;
  installed: string;
  orderForMySpaceMenu: number;
  orderForTopMenu: number;
  showInMySpace: boolean;
  showInTopMenu: boolean;
}

export interface Product extends Model {
  name: string;
  code: string;
  description?: string;
  images?: Array<string | number>;
  salePrice: number;
  costPrice: number;
  featured?: number;
  createdOn?: string;
  saleCurrency?: Currency;
  displaySalePrice: string;
  displayCostPrice: string;
  allowCustomNote?: boolean;
}

export interface Currency extends Model {
  name: string;
  code: string;
  symbol: string;
  numberOfDecimals: number;
}

export interface Cart extends Model {
  items: CartItem[];
}

export interface CartItem extends Model {
  quantity: string | number;
  cart: Cart['id'];
  product: Product['id'];
  note?: string;
}

export interface Partner extends Model {
  name: string;
  firstName?: string;
}

export interface City extends Model {
  name: string;
}

export interface Country extends Model {
  name: string;
}

export interface Address extends Model {
  addressl2?: string;
  addressl3?: string;
  addressl4?: string;
  addressl5?: string;
  addressl6?: string;
  country?: Country;
  city?: City;
  zip?: string;
}

export interface PartnerAddress extends Model {
  isDeliveryAddr: boolean;
  isInvoicingAddr: boolean;
  isDefaultAddr: boolean;
  address: Address;
}

export interface Company extends Model {
  name: string;
}

export type ComputedProduct = {
  product: Product;
  scale: {
    unit: number;
    currency: number;
  };
  tax: {
    value: number;
  };
  price: {
    ati?: number | string;
    wt?: number | string;
    primary?: number | string;
    secondary?: number | string;
    displayAti?: string;
    displayWt?: string;
    displayPrimary?: string;
    displaySecondary?: string;
    mainPrice?: PortalAppConfig['mainPrice'];
    displayTwoPrices?: boolean;
  };
  currency: Currency;
};

export type MetaFile = {
  id: ID;
  fileName: string;
};

export type Category = {
  name: string;
  id: number | string;
  items?: Category[];
};

export interface Unit {
  id: ID;
  name: string;
}

export type Item = {
  key: string;
  label: string;
};

export type Participant = {
  id?: ID;
  name: string;
  surname: string;
  emailAddress: string;
  phone: string;
  contact?: any;
};

export type Comment = {
  image?: any;
  contentComment: string;
  publicationDateTime: Date;
};

export enum PaymentOption {
  paypal = 'paypal',
  stripe = 'stripe',
}

export type Tenant = {
  id: string;
  db: {
    url: string;
  };
  aos: {
    url: string;
    auth: {
      username: string;
      password: string;
    };
  };
};
