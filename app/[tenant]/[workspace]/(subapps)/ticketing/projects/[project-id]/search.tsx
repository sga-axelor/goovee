'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';

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

export function Search({workspace}: {workspace: PortalWorkspace}) {
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    setOpen(search ? true : false);
    if (search) {
      findTickets({search, workspace}).then(setTickets);
    }
  }, [search, workspace]);

  return (
    <div className="w-full relative">
      <Command className="p-0 bg-white">
        <CommandInput
          placeholder="Search here"
          className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] pr-[132px] h-12 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
          value={search}
          onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
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
                    value={ticket.title}
                    className="block py-2 sm:px-6">
                    <ResourceItem ticket={ticket} />
                  </CommandItem>
                ))
              : null}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

function ResourceItem({ticket}: any) {
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleRedirection = (ticket: any) => () => {};

  return (
    <div
      className="border-b cursor-pointer"
      key={ticket.id}
      onClick={handleRedirection(ticket)}>
      <div className="leading-5 text-sm space-y-2">
        <div className="flex items-center">
          <div className="flex items-center gap-2 grow">
            <h3 className="font-semibold line-clamp-1">{ticket.title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
