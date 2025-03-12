import {PortalWorkspace} from '@/types';

export interface Event {
  key: string | undefined;
  id: string;
  eventTitle: string;
  eventStartDateTime: string;
  eventImage: {
    id: string | number;
  };
  eventEndDateTime: string;
  eventDescription: string;
  eventCategorySet: [Category];
  eventAllowRegistration: boolean;
  eventAllowMultipleRegistrations: boolean;
  eventAllDay: boolean;
  isRegistered?: boolean;
  _count: number | undefined;
  _hasNext: boolean;
  eventProduct: {
    salePrice: string;
    saleCurrency: {
      numberOfDecimals: number;
      symbol: string;
    };
  } | null;
  defaultPrice: number;
  formattedDefaultPrice: string;
  formattedDefaultPriceAti: string;
  displayAtiPrice: string;
  displayAti: string;
  facilityList: [
    {
      id: number;
      price: number;
      formattedPrice: string;
      facility: string;
      additionalFieldSet: any[];
    },
  ];
  slug: string;
  isPrivate: boolean;
  isHidden: boolean;
  isPublic: boolean;
  isLoginNotNeeded: boolean;
  maxParticipantPerEvent: number;
  maxParticipantPerRegistration: number;
  additionalFieldSet: any[];
}
export interface EventsProps {
  events: Event[];
}
export interface perPageProps {
  perpage: number;
}
export interface Category {
  id: string;
  name: string;
  color: string;
  version: number;
}
export interface CategoriesProps {
  eventsCategories: Category[];
}
export interface EventCardProps {
  event: Event;
}
