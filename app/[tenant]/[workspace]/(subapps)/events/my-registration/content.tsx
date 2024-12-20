'use client';

// ---- LOCAL IMPORTS ---- //
import {
  Category,
  Event,
  MyRegisteredEvents,
} from '@/subapps/events/common/ui/components';

type ContentProps = {
  categories: Category[];
  category: any;
  date: any;
  workspace: any;
  onGoingEvents: Event[];
  upcomingEvents: Event[];
  pastEvents: Event[];
  pageInfo: any;
  showPastEvents: boolean;
};

const Content = ({
  categories,
  category,
  date,
  workspace,
  onGoingEvents,
  upcomingEvents,
  pastEvents,
  pageInfo,
  showPastEvents,
}: ContentProps) => {
  return (
    <main className="h-full w-full">
      <MyRegisteredEvents
        categories={categories}
        category={category}
        dateOfEvent={date}
        workspace={workspace}
        onlyRegisteredEvent={true}
        onGoingEvents={onGoingEvents}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        pageInfo={pageInfo}
        showPastEvents={showPastEvents}
      />
    </main>
  );
};

export default Content;
