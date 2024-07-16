'use client';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import type {ChangeEvent} from 'react';
import {MdOutlineSearch} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components';
import {cn} from '@/utils/css';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {DATE_FORMATS} from '@/constants';
import {parseDate} from '@/utils';

// ---- LOCAL IMPORTS ---- //
import type {HeroProps} from '@/subapps/events/common/ui/components';
import type {Event} from '@/subapps/events/common/ui/components';
import {getAllEvents} from '@/subapps/events/common/actions/actions';
import styles from '@/subapps/events/common/ui/components/hero/hero.module.css';

export const Hero = ({className}: HeroProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isCommandOpen, setIsCommandOpen] = useState<boolean>(false);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const {workspaceURI} = useWorkspace();

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    try {
      const events = await getAllEvents({
        search: e.target.value,
      });
      setAllEvents(events);
      setIsCommandOpen(e.target.value.length > 0);
    } catch (err) {
      console.log(err);
    }
  };
  const commandRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      commandRef.current &&
      !commandRef.current.contains(event.target as Node)
    ) {
      setIsCommandOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        'lg:w-auto w-screen h-[18.75rem] lg:h-[22.063rem] flex items-center justify-center',
        styles['hero-bg'],
        className,
      )}>
      <div className="px-4 z-10 flex text-white items-center flex-col justify-center">
        <h2 className="lg:text-[2rem] text-2xl font-semibold mb-2">Events</h2>
        <p className="lg:text-lg text-base font-medium mb-8 md:max-w-screen-sm lg:max-w-screen-md text-center">
          Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium
          etiam viverra. Ac at non pretium etiam
        </p>
        <div className="w-full relative">
          <Command ref={commandRef} className="p-0 bg-white">
            <CommandInput
              placeholder="Search here"
              className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-14 py-4 pr-4 h-14 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
              value={inputValue}
              onChangeCapture={handleInputChange}
            />

            <CommandList
              className={cn(
                'absolute bg-white top-[3.75rem] border border-grey-1 rounded-lg text-main-black z-50 w-full p-0',
                styles['no-scrollbar'],
                {block: isCommandOpen, hidden: !isCommandOpen},
              )}>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup className="py-2 px-4">
                {allEvents &&
                  allEvents.length > 0 &&
                  allEvents.map(event => (
                    <CommandItem
                      key={event.id}
                      value={event.eventTitle}
                      className="block py-2 sm:px-6">
                      <Link
                        href={`${workspaceURI}/events/${event.id}`}
                        className="space-y-2">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-main-black pr-2">
                            {event.eventTitle}
                          </p>
                          <p className="text-sm font-normal text-main-black min-w-fit">
                            {parseDate(
                              event.eventStartDateTime,
                              DATE_FORMATS.full_month_day_year_12_hour,
                            )}
                          </p>
                        </div>
                        <p className="overflow-hidden text-xs font-normal text-main-black line-clamp-1">
                          {event.eventDescription}
                        </p>
                      </Link>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>

          <MdOutlineSearch className="absolute top-4 left-4 size-6 text-main-black" />
        </div>
      </div>
    </div>
  );
};
