import type {PageInfo} from '@/types';
import type {Cloned} from '@/types/util';
import type {
  ListEvent as OrmListEvent,
  Category,
} from '@/subapps/events/common/types';

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
