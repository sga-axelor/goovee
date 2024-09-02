'use client';

import {useRouter} from 'next/navigation';
import React, {useCallback, useEffect, useMemo, useState} from 'react';

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
import type {PortalWorkspace} from '@/types';
import {findTickets} from './action';
import {debounce} from 'lodash';
import {ID} from '@goovee/orm';

export function Search({
  workspace,
  projectId,
  className,
  inputClassName,
}: {
  workspace: PortalWorkspace;
  projectId: ID;
  inputClassName?: string;
  className?: string;
}) {
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = useMemo(
    () =>
      debounce((search: string) => {
        if (search) {
          findTickets({search: search, workspace, projectId}).then(setTickets);
        } else {
          setTickets([]);
        }
      }, 500),
    [workspace, projectId],
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setOpen(!!query);
      setSearch(query);
      fetchTickets(query);
    },
    [fetchTickets],
  );

  return (
    <div className={cn('w-full relative', className)}>
      <Command className="p-0 bg-white">
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
            'absolute bg-white top-[60px] right-0 border border-grey-1 rounded-lg no-scrollbar text-main-black z-50 w-full p-0',
            open ? 'block' : 'hidden',
          )}>
          <CommandEmpty>{i18n.get('No results found.')}</CommandEmpty>
          <CommandGroup className="p-2">
            {Boolean(tickets?.length)
              ? tickets.map(ticket => (
                  <CommandItem
                    key={ticket.id}
                    value={ticket.name}
                    className="block py-2 sm:px-6">
                    <ResourceItem ticket={ticket} projectId={projectId} />
                  </CommandItem>
                ))
              : null}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

function ResourceItem({ticket, projectId}: any) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleRedirection = (ticket: any) => () => {
    router.push(
      `${workspaceURI}/ticketing/projects/${projectId}/tickets/${ticket.id}`,
    );
  };

  return (
    <div
      className="border-b cursor-pointer"
      key={ticket.id}
      onClick={handleRedirection(ticket)}>
      <div className="leading-5 text-sm space-y-2 p-3">
        <h3 className="font-semibold line-clamp-1">{ticket.name}</h3>
      </div>
    </div>
  );
}

export default Search;
