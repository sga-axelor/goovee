'use client';

import {useRouter} from 'next/navigation';
import React, {useCallback, useMemo, useState} from 'react';

// ---- CORE IMPORTS ---- //

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components/command';
import {cn} from '@/utils/css';
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {searchTickets} from '../../common/actions';
import {debounce} from 'lodash';
import {ID} from '@goovee/orm';
import {useToast} from '@/ui/hooks';

export function Search({
  projectId,
  className,
  inputClassName,
}: {
  projectId?: ID;
  inputClassName?: string;
  className?: string;
}) {
  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = useMemo(
    () =>
      debounce(async (search: string) => {
        if (!search) return setTickets([]);
        const {error, message, data} = await searchTickets({
          search: search,
          workspaceURL,
          projectId,
        });
        if (error) {
          setTickets([]);
          toast({
            variant: 'destructive',
            title: message,
          });
          return;
        }
        setTickets(data);
        setLoading(false);
      }, 500),
    [workspaceURL, projectId, toast],
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setLoading(true);
      setOpen(!!query);
      setSearch(query);
      fetchTickets(query);
    },
    [fetchTickets],
  );

  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleRedirection = (ticketId: string) => {
    router.push(
      `${workspaceURI}/ticketing/projects/${projectId}/tickets/${ticketId}`,
    );
  };

  return (
    <div className={cn('w-full relative', className)}>
      <Command className="p-0 bg-card" shouldFilter={false}>
        <CommandInput
          placeholder="Search here"
          className={cn(
            'lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] pr-[132px] h-12 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black',
            inputClassName,
          )}
          value={search}
          onChangeCapture={handleSearch}
        />

        <CommandList
          className={cn(
            'absolute bg-card top-[60px] right-0 border border-grey-1 rounded-lg no-scrollbar text-main-black z-50 w-full p-0',
            open ? 'block' : 'hidden',
          )}>
          <CommandEmpty>
            {loading ? i18n.get('Searching...') : i18n.get('No results found.')}
          </CommandEmpty>
          <CommandGroup className="p-2">
            {Boolean(tickets?.length)
              ? tickets.map(ticket => (
                  <CommandItem
                    key={ticket.id}
                    value={ticket.id}
                    onSelect={handleRedirection}
                    className="block py-2 sm:px-6 cursor-pointer">
                    <div className="leading-5 text-sm space-y-2 p-3">
                      <h3 className="font-semibold line-clamp-1">
                        {ticket.name}
                      </h3>
                    </div>
                  </CommandItem>
                ))
              : null}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default Search;
