import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {AOSProjectTask} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {Maybe} from '@/types/util';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';
import {useResponsive, useToast} from '@/ui/hooks';
import {ID} from '@goovee/orm';
import {Drawer, DrawerContent, DrawerTrigger} from '@ui/components/drawer';
import {debounce} from 'lodash';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {searchTickets} from '../../../actions';

const INIT_SEARCH_VALUE = undefined;
export function TicketSelect({
  className,
  value,
  onChange,
  ticketId,
}: {
  value: Maybe<AOSProjectTask>;
  onChange: (ticket: AOSProjectTask) => void;
  ticketId: ID;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const res = useResponsive();
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);
  const searchRef = useRef<string | undefined>(INIT_SEARCH_VALUE);
  const [loading, setLoading] = useState(true);

  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();
  const [tickets, setTickets] = useState<any[]>([]);

  const fetchTickets = useCallback(
    async (search?: string) => {
      try {
        const {error, message, data} = await searchTickets({
          search: search,
          workspaceURL,
          excludeList: [ticketId],
        });
        if (searchRef.current !== search) return;
        if (error) {
          setTickets([]);
          toast({
            variant: 'destructive',
            title: message,
          });
          return;
        }
        setTickets(data);
      } catch (e) {
        toast({
          variant: 'destructive',
          title: i18n.get('Something went wrong'),
        });
      } finally {
        if (searchRef.current === search) {
          setLoading(false);
        }
      }
    },
    [workspaceURL, toast, ticketId],
  );

  const debouncedFetchTickets = useMemo(
    () => debounce(fetchTickets, 500),
    [fetchTickets],
  );

  const handleSearch = useCallback(
    (search?: string) => {
      setLoading(true);
      searchRef.current = search;
      debouncedFetchTickets(search);
    },
    [debouncedFetchTickets],
  );

  const handleSelect = useCallback(
    (value: any) => {
      onChange(value);
      setOpen(false);
    },
    [onChange],
  );

  useEffect(() => {
    fetchTickets(INIT_SEARCH_VALUE);
  }, [fetchTickets]);

  const [Controller, Trigger, Content] = small
    ? ([Drawer, DrawerTrigger, DrawerContent] as const)
    : ([Popover, PopoverTrigger, PopoverContent] as const);

  const panel = (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder={i18n.get('Search tickets')}
        onValueChange={handleSearch}
        loading={loading}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? i18n.get('Searching...') : i18n.get('No results found.')}
        </CommandEmpty>
        <CommandGroup>
          {tickets.map(option => (
            <CommandItem
              key={option.id}
              value={option.id.toString()}
              onSelect={() => handleSelect(option)}>
              {option.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  const buttonWidth = buttonRef.current?.offsetWidth;
  return (
    <Controller open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="outline" className={className} ref={buttonRef}>
          {value ? value.name : i18n.get('Select ticket')}
        </Button>
      </Trigger>
      <Content
        align="start"
        style={
          small
            ? undefined
            : {
                width: buttonWidth ? `${buttonWidth}px` : '300px',
              }
        }>
        {small ? <div className="mt-4 border-t">{panel}</div> : panel}
      </Content>
    </Controller>
  );
}
