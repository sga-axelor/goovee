'use client';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
import {useMediaQuery, useResponsive, useToast} from '@/ui/hooks';
import {Drawer, DrawerContent, DrawerTrigger} from '@ui/components/drawer';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {
  assignToSupplier,
  cancelTicket,
  closeTicket,
  createLink,
  searchTickets,
} from '../../../actions';
import {useRetryAction} from '../../../hooks';
import {X} from 'lucide-react';
import {MdAdd} from 'react-icons/md';
import {
  AOSProjectTask,
  AOSProjectTaskLinkType,
} from '@/goovee/.generated/models';
import {debounce} from 'lodash';
import {Maybe} from '@/types/util';
import {cn} from '@/utils/css';
import {useRouter} from 'next/navigation';
import {ID} from '@goovee/orm';

export function CancelTicket({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    cancelTicket,
    i18n.get('Ticket canceled'),
  );

  const handleClick = useCallback(async () => {
    await action({
      data: {id: id, version: version},
      workspaceURL,
    });
  }, [id, version, workspaceURL, action]);

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Cancel ticket')}
    </Button>
  );
}

export function CloseTicket({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    closeTicket,
    i18n.get('Ticket closed'),
  );

  const handleClick = useCallback(async () => {
    await action({
      data: {id: id, version: version},
      workspaceURL,
    });
  }, [id, version, workspaceURL, action]);

  return (
    <Button
      size="sm"
      variant="success"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Close ticket')}
    </Button>
  );
}

export function AssignToSupplier({id, version}: {id: string; version: number}) {
  const {workspaceURL} = useWorkspace();
  const {action, loading} = useRetryAction(
    assignToSupplier,
    i18n.get('Ticket assinged to supplier'),
  );

  const handleClick = useCallback(async () => {
    await action({
      data: {id: id, version: version},
      workspaceURL,
    });
  }, [id, version, workspaceURL, action]);

  return (
    <Button
      size="sm"
      type="button"
      variant="success"
      disabled={loading}
      onClick={handleClick}>
      {i18n.get('Assign to supplier')}
    </Button>
  );
}

export function RelatedTicketsHeader({
  linkTypes,
  ticketId,
}: {
  linkTypes: {
    id: string;
    name: string;
  }[];
  ticketId: ID;
}) {
  const {workspaceURL} = useWorkspace();
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const [selectedTicket, setSelectedTicket] =
    useState<Maybe<AOSProjectTask>>(null);
  const [selectedLinkType, setSelectedLinkType] = useState(linkTypes[0].id);

  const handleCreateLink = async () => {
    if (selectedTicket?.id && selectedLinkType) {
      const {error, message, data} = await createLink({
        workspaceURL,
        data: {
          linkType: selectedLinkType,
          linkTicketId: selectedTicket.id,
          currentTicketId: ticketId,
        },
      });
      if (error) {
        return toast({
          variant: 'destructive',
          title: message,
        });
      }
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold">{i18n.get('Related tickets')}</h4>
        {!showAlert && (
          <Button
            size="sm"
            type="button"
            variant="success"
            onClick={() => setShowAlert(true)}>
            <MdAdd className="size-6 lg:me-1" />
            <span className="hidden lg:inline">
              {i18n.get('Add related ticket')}
            </span>
          </Button>
        )}
      </div>
      {showAlert && (
        <Alert variant="success" className="group">
          <button
            className="ring-0 absolute right-2 top-2 rounded-md cursor-pointer p-1 text-foreground/50 lg:opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none group-hover:opacity-100"
            onClick={() => setShowAlert(false)}>
            <X className="h-4 w-4" />
          </button>
          <AlertTitle>{i18n.get('Add related ticket')}</AlertTitle>
          <AlertDescription className="flex flex-wrap gap-4 p-2">
            <Select
              onValueChange={setSelectedLinkType}
              value={selectedLinkType}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {linkTypes.map(linkType => (
                  <SelectItem value={linkType.id} key={linkType.id}>
                    {linkType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ComboBoxResponsive
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              ticketId={ticketId}
            />

            <Button size="sm" variant="success" onClick={handleCreateLink}>
              {i18n.get('Create Link')}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function ComboBoxResponsive({
  selectedTicket,
  setSelectedTicket,
  ticketId,
}: {
  selectedTicket: Maybe<AOSProjectTask>;
  setSelectedTicket: (ticket: AOSProjectTask) => void;
  ticketId: ID;
}) {
  const [open, setOpen] = useState(false);
  const res = useResponsive();
  const small = (['xs', 'sm'] as const).some(x => res[x]);

  const [Controller, Trigger, Content] = small
    ? ([Drawer, DrawerTrigger, DrawerContent] as const)
    : ([Popover, PopoverTrigger, PopoverContent] as const);

  const ticketList = (
    <TicketList
      ticketId={ticketId}
      setOpen={setOpen}
      setSelectedTicket={setSelectedTicket}
    />
  );

  return (
    <Controller open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedTicket ? selectedTicket.name : i18n.get('Select ticket')}
        </Button>
      </Trigger>
      <Content className={cn({['w-[200px] p-0']: !small})} align="start">
        {small ? <div className="mt-4 border-t">{ticketList}</div> : ticketList}
      </Content>
    </Controller>
  );
}

function TicketList({
  setOpen,
  setSelectedTicket,
  ticketId,
}: {
  setOpen: (open: boolean) => void;
  setSelectedTicket: (ticket: AOSProjectTask) => void;
  ticketId: ID;
}) {
  const {workspaceURL} = useWorkspace();
  const {toast} = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(
    async (search?: string) => {
      const {error, message, data} = await searchTickets({
        search: search,
        workspaceURL,
        excludeList: [ticketId],
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
    },
    [workspaceURL, toast, ticketId],
  );

  const debouncedFetchTickets = useMemo(
    () => debounce(fetchTickets, 500),
    [fetchTickets],
  );

  const handleSearch = useCallback(
    (query: string) => {
      setLoading(true);
      debouncedFetchTickets(query);
    },
    [debouncedFetchTickets],
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder={i18n.get('Search tickets')}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? i18n.get('Searching...') : i18n.get('No results found.')}
        </CommandEmpty>
        <CommandGroup>
          {tickets.map(ticket => (
            <CommandItem
              key={ticket.id}
              value={ticket.id}
              onSelect={value => {
                setOpen(false);
                setSelectedTicket(tickets.find(ticket => ticket.id === value));
              }}>
              {ticket.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
