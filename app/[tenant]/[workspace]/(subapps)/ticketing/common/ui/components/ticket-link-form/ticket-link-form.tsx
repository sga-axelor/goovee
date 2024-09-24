import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/ui/components/form';
import {useToast} from '@/ui/hooks';
import {ID} from '@goovee/orm';
import {zodResolver} from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';

import {createLink} from '../../../actions';
import {RelatedTicketSchema} from '../../../schema';
import {TicketSelect} from '../ticket-select';

export function TicketLinkForm({
  linkTypes,
  ticketId,
  onSubmit,
}: {
  linkTypes: {
    id: string;
    name: string;
  }[];
  ticketId: ID;
  onSubmit: () => void;
}) {
  const {workspaceURL} = useWorkspace();
  const router = useRouter();
  const {toast} = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof RelatedTicketSchema>>({
    resolver: zodResolver(RelatedTicketSchema),
    defaultValues: {
      linkType: linkTypes[0]?.id,
      ticket: undefined,
    },
  });

  const handleSubmit = async (values: z.infer<typeof RelatedTicketSchema>) => {
    const {error, message, data} = await createLink({
      workspaceURL,
      data: {
        linkType: values.linkType,
        linkTicketId: values.ticket.id,
        currentTicketId: ticketId,
      },
    });
    if (error) {
      return toast({
        variant: 'destructive',
        title: message,
      });
    }
    onSubmit();
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4">
        <div className="flex gap-4 p-2 flex-col lg:flex-row">
          <FormField
            control={form.control}
            name="linkType"
            render={({field}) => (
              <FormItem className="lg:grow-[1] text-primary">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger>
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ticket"
            render={({field}) => (
              <FormItem className="lg:grow-[2]">
                <FormControl>
                  <TicketSelect
                    className="w-full border-input"
                    value={field.value}
                    onChange={field.onChange}
                    ticketId={ticketId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button size="sm" variant="success" className="ms-auto">
          {i18n.get('Create Link')}
        </Button>
      </form>
    </Form>
  );
}
