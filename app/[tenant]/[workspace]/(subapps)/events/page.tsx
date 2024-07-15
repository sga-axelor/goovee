// ---- CORE IMPORTS ----//
import {findEventCategories} from '@/app/events/common/orm/event-category';
import {clone} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import {Category} from '@/app/events/common/ui/components';
import {getAllEvents} from '@/app/events/common/actions/actions';
import Content from '@/app/events/content';
import {LIMIT} from '@/app/events/common/constants';

export default async function Page(context: any) {
  const page = context?.searchParams?.page || 1;

  const category = context?.searchParams?.category
    ? Array.isArray(context?.searchParams?.category)
      ? context?.searchParams?.category
      : [context?.searchParams?.category]
    : [];

  const date = context?.searchParams?.date || undefined;

  const events = await getAllEvents({
    limit: LIMIT,
    page: page,
    categories: category,
    day: new Date(date).getDate() || undefined,
    month: new Date(date).getMonth() + 1 || undefined,
    year: new Date(date).getFullYear() || undefined,
  });

  const categories: Category[] = await findEventCategories().then(clone);

  return (
    <Content
      category={category}
      categories={categories}
      events={events}
      page={page}
      date={date}
    />
  );
}
