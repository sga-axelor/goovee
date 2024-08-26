'use client';

import {
  AOSProjectPriority,
  AOSProjectTaskStatus,
  AOSUser,
} from '@/goovee/.generated/models';
import {i18n} from '@/lib/i18n';
import {
  Badge,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components';
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
import {zodResolver} from '@hookform/resolvers/zod';
import {Close} from '@radix-ui/react-popover';
import {useRouter} from 'next/navigation';
import {useEffect, useRef} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {FaFilter} from 'react-icons/fa';
import {z} from 'zod';

import type {FilterKey} from '../../../types';
import {SearchParams} from '../../../types/search-param';
import {
  decodeFilterParams,
  encodeFilterQuery,
} from '../../../utils/search-param';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../multi-select';

const filterSchema = z.object({
  requestedBy: z.array(z.string()),
  //TODO: validate such that if toDate is set, fromDate should also be set, and fromDate < toDate
  priority: z.array(z.string()),
  status: z.array(z.string()),
  updatedOn: z.array(z.string()),
});
type FilterProps = {
  url: string;
  searchParams: SearchParams<FilterKey>;
  users: AOSUser[];
  priorities: AOSProjectPriority[];
  statuses: AOSProjectTaskStatus[];
};

const defaultValues = {
  requestedBy: [] as string[],
  updatedOn: [] as string[],
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
    const {requestedBy, priority, updatedOn, status} = value;

    if (sort) params.set('sort', sort);
    if (limit) params.set('sort', limit);

    if (requestedBy?.length) {
      params.set('requestedBy', encodeFilterQuery('in', requestedBy));
    }

    if (status?.length) params.set('status', encodeFilterQuery('in', status));

    if (priority?.length) {
      params.set('priority', encodeFilterQuery('in', priority));
    }

    if (updatedOn?.length && updatedOn[0] && updatedOn[1]) {
      params.set('updatedOn', encodeFilterQuery('between', updatedOn));
    }

    const route = `${url}?${params.toString()}`;
    router.push(route);
  };

  useEffect(() => {
    const values = structuredClone(defaultValues);
    const {sort, page, limit, ...filterParams} = searchParams;
    const {requestedBy, status, updatedOn, priority} =
      decodeFilterParams(filterParams);
    if (requestedBy) values.requestedBy = requestedBy;
    if (priority) values.priority = priority;
    if (status) values.status = status;
    if (updatedOn) values.updatedOn = updatedOn;
    form.reset(values);
  }, [searchParams, form]);
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{i18n.get('Filter :')}</h3>
      </div>
      <Popover>
        <PopoverTrigger asChild>
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
            <MultiSelectorTrigger
              renderLabel={value =>
                users.find(user => user.id === value)?.name
              }>
              <MultiSelectorInput placeholder="Select users" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {users.map(user => (
                  <MultiSelectorItem key={user.id} value={user.id}>
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
        name="updatedOn"
        render={({field}) => (
          <FormItem>
            <FormLabel>{i18n.get('From:')}</FormLabel>
            <FormControl>
              <Input
                type="date"
                placeholder="DD/MM/YYYY"
                {...field}
                value={field.value?.[0] ?? ''}
                onChange={e => {
                  const from = e.target.value;
                  if (!from) return field.onChange([]);
                  const to = field.value?.[1];
                  if (to) return field.onChange([from, to]);
                  return field.onChange([from]);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="updatedOn"
        render={({field}) => (
          <FormItem>
            <FormLabel>{i18n.get('To:')}</FormLabel>
            <FormControl>
              <Input
                type="date"
                placeholder="DD/MM/YYYY"
                {...field}
                disabled={field.disabled || !Boolean(field.value?.[0])}
                value={field.value?.[1] ?? ''}
                onChange={e => {
                  const to = e.target.value;
                  const from = field.value?.[0];
                  if (from && to) return field.onChange([from, to]);
                  if (from) return field.onChange([from]);
                }}
              />
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
                      name={priority.id}
                      checked={field.value?.includes(priority.id)}
                      onCheckedChange={checked =>
                        checked
                          ? field.onChange([
                              ...(field.value ?? []),
                              priority.id,
                            ])
                          : field.onChange(
                              field.value?.filter(
                                value => value !== priority.id,
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
            <MultiSelectorTrigger
              renderLabel={value =>
                statuses.find(status => status.id === value)?.name
              }>
              <MultiSelectorInput placeholder="Select statuses" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {statuses.map(status => (
                  <MultiSelectorItem key={status.id} value={status.id}>
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
