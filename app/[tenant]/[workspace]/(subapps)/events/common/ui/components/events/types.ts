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
  eventDegressiveNumberPartcipant: number;
  eventCategorySet: [Category];
  eventAllowRegistration: boolean;
  eventAllowMultipleRegistrations: boolean;
  eventAllDay: boolean;
  isRegistered?: boolean;
  _count: number | undefined;
  _hasNext: boolean;
  eventProduct: {
    salePrice: string;
  } | null;
  defaultPrice: string;
  displayAtiPrice: string;
  facilityList: [
    {
      id: number;
      price: number;
      facility: string;
    },
  ];
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
  workspace: PortalWorkspace;
}
