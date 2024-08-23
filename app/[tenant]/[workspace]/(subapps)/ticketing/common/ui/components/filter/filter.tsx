'use client';

import {useEffect, useRef} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm, UseFormReturn} from 'react-hook-form';
import {z} from 'zod';
import {Button} from '@/ui/components/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {Input} from '@/ui/components/input';
import {
  Badge,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';

import {i18n} from '@/lib/i18n';
import {FaFilter} from 'react-icons/fa';
import {
  AOSProjectPriority,
  AOSProjectTaskStatus,
  AOSUser,
} from '@/goovee/.generated/models';
import {useRouter} from 'next/navigation';
import {Close} from '@radix-ui/react-popover';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../multi-select';

const filterSchema = z.object({
  requestedBy: z.array(z.string()).optional(),
  //TODO: validate such that if toDate is set, fromDate should also be set, and fromDate < toDate
  toDate: z.string().optional(),
  fromDate: z.string().optional(),
  priority: z.array(z.string().optional()),
  status: z.array(z.string()).optional(),
});
type FilterProps = {
  url: string;
  searchParams: Record<string, string | undefined>;
  users: AOSUser[];
  priorities: AOSProjectPriority[];
  statuses: AOSProjectTaskStatus[];
};

const defaultValues = {
  requestedBy: [] as string[],
  toDate: '',
  fromDate: '',
  priority: [] as string[],
  status: [] as string[],
};

export function Filter(props: FilterProps) {
  const {users, priorities, statuses, url, searchParams} = props;
  const {sort, page, limit, ...filterParams} = searchParams;
  const filterCount = Object.keys(filterParams).reduce((acc, v) => ++acc, 0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  });

  const onSubmit = (value: z.infer<typeof filterSchema>) => {
    const params = new URLSearchParams();
    const {requestedBy, priority, toDate, fromDate, status} = value;

    if (sort) params.set('sort', sort);
    if (limit) params.set('sort', limit);

    if (requestedBy && requestedBy.length) {
      params.set('requestedBy', requestedBy.join(','));
    }

    if (status && status.length) {
      params.set('status', status.join(','));
    }

    if (priority.length) {
      params.set('priority', priority.filter(Boolean).join());
    }

    if (toDate && fromDate) {
      params.set('updatedOn', `${fromDate} ${toDate}`);
    }

    const route = `${url}?${params.toString()}`;
    router.push(route);
  };

  useEffect(() => {
    const values: z.infer<typeof filterSchema> = structuredClone(defaultValues);

    const {requestedBy, priority, updatedOn, status} = searchParams;
    if (requestedBy) values.requestedBy = requestedBy.split(',');
    if (priority) values.priority = priority.split(',');
    if (status) values.status = status.split(',');
    if (updatedOn) {
      const [fromDate, toDate] = updatedOn.split(' ');
      if (fromDate) values.fromDate = fromDate;
      if (toDate) values.toDate = toDate;
    }

    form.reset(values);
  }, [searchParams, form]);
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{i18n.get('Filter :')}</h3>
      </div>
      <Popover>
        <PopoverTrigger>
          <Button
            variant={filterCount ? 'default' : 'outline'}
            className="flex justify-between w-[354px] h-[47px]">
            <div className="flex items-center space-x-2">
              <FaFilter />
              <span> {i18n.get('Filter')}</span>
            </div>
            <Badge
              className="ms-auto"
              variant={filterCount ? 'destructive' : 'default'}>
              {filterCount}
            </Badge>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[22.7rem] w-74 overflow-y-auto">
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <RequestedByField form={form} users={users} />
                <DatesField form={form} />
                <PriorityField form={form} priorities={priorities} />
                <StatusField form={form} statuses={statuses} />
                <Close asChild>
                  <Button variant="success" type="submit" className="w-full">
                    {i18n.get('Apply')}
                  </Button>
                </Close>
              </div>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function RequestedByField(props: FieldProps & Pick<FilterProps, 'users'>) {
  const {form, users} = props;
  return (
    <FormField
      control={form.control}
      name="requestedBy"
      render={({field}) => (
        <FormItem>
          <FormLabel>{i18n.get('Requested by :')}</FormLabel>
          <MultiSelector onValuesChange={field.onChange} values={field.value}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select users" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {users.map(user => (
                  <MultiSelectorItem key={user.name} value={user.name}>
                    <div className="flex items-center space-x-2">
                      <span>{user.name}</span>
                    </div>
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function DatesField(props: FieldProps) {
  const {form} = props;
  return (
    <div className="flex gap-2">
      <FormField
        control={form.control}
        name="fromDate"
        render={({field}) => (
          <FormItem>
            <FormLabel>{i18n.get('From:')}</FormLabel>
            <FormControl>
              <Input type="date" placeholder="DD/MM/YYYY" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="toDate"
        render={({field}) => (
          <FormItem>
            <FormLabel>{i18n.get('To:')}</FormLabel>
            <FormControl>
              <Input type="date" placeholder="DD/MM/YYYY" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function PriorityField(props: FieldProps & Pick<FilterProps, 'priorities'>) {
  const {form, priorities} = props;
  return (
    <FormField
      control={form.control}
      name="priority"
      render={({field}) => (
        <FormItem>
          <FormLabel>{i18n.get('Priority :')}</FormLabel>
          {priorities.map(priority => (
            <FormField
              key={priority.id}
              control={form.control}
              name="priority"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      name={priority.name}
                      checked={field.value?.includes(priority.name)}
                      onCheckedChange={checked =>
                        checked
                          ? field.onChange([...field.value, priority.name])
                          : field.onChange(
                              field.value?.filter(
                                value => value !== priority.name,
                              ),
                            )
                      }
                    />
                  </FormControl>
                  <FormLabel className="ml-4 text-xs">
                    {priority.name}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type FieldProps = {
  form: UseFormReturn<z.infer<typeof filterSchema>>;
};

function StatusField(props: FieldProps & Pick<FilterProps, 'statuses'>) {
  const {form, statuses} = props;
  return (
    <FormField
      control={form.control}
      name="status"
      render={({field}) => (
        <FormItem>
          <FormLabel>{i18n.get('Status :')}</FormLabel>
          <MultiSelector onValuesChange={field.onChange} values={field.value}>
            <MultiSelectorTrigger>
              <MultiSelectorInput placeholder="Select statuses" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {statuses.map(status => (
                  <MultiSelectorItem key={status.name} value={status.name}>
                    <div className="flex items-center space-x-2">
                      <span>{status.name}</span>
                    </div>
                  </MultiSelectorItem>
                ))}
              </MultiSelectorList>
            </MultiSelectorContent>
          </MultiSelector>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
