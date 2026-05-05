import type {PageInfo} from '@/types';
import type {Cloned} from '@/types/util';
import type {ListEvent as OrmListEvent} from '@/subapps/events/common/orm/event';
import type {Category} from '@/subapps/events/common/orm/event-category';

export type {Category};

export type ListEvent = Cloned<OrmListEvent>;

export interface EventCardProps {
  event: ListEvent;
}

export interface CategoriesProps {
  eventsCategories: Category[];
}

export interface EventsProps {
  events: ListEvent[];
  pageInfo: PageInfo;
}
