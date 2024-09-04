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
import {Drawer, DrawerContent, DrawerTrigger} from '@/ui/components/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {Input} from '@/ui/components/input';
import {useResponsive} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {decodeFilter, encodeFilter} from '@/utils/filter';
import {zodResolver} from '@hookform/resolvers/zod';
import {pick} from 'lodash';
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {FaFilter} from 'react-icons/fa';
import {z} from 'zod';

import {SearchParams} from '../../../types/search-param';
import {EncodedFilterSchema, FilterSchema} from '../../../utils/search-param';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '../multi-select';

type FilterProps = {
  url: string;
  searchParams: SearchParams;
  users: AOSUser[];
  priorities: AOSProjectPriority[];
  statuses: AOSProjectTaskStatus[];
};

const defaultValues = {
  requestedBy: [] as string[],
  updatedOn: ['', ''] as [string, string],
  priority: [] as string[],
  status: [] as string[],
};

export function Filter(props: FilterProps) {
  const {users, priorities, statuses, url, searchParams} = props;
  const [open, setOpen] = useState(false);
  const filter = useMemo(
    () => searchParams.filter && decodeFilter(searchParams.filter),
    [searchParams.filter],
  );
  const filterCount = useMemo(
    () => (filter ? Object.keys(filter).length : 0),
    [filter],
  );

  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const res = useResponsive();
  const small = (['xs', 'sm'] as const).some(x => res[x]);

  const form = useForm<z.infer<typeof FilterSchema>>({
    resolver: zodResolver(FilterSchema),
    defaultValues,
  });

  const onSubmit = (value: z.infer<typeof FilterSchema>) => {
    const dirtyFieldKeys = Object.keys(form.formState.dirtyFields);

    if (!dirtyFieldKeys.length) return setOpen(false);
    const dirtyValues = pick(value, dirtyFieldKeys);

    const filter = EncodedFilterSchema.parse(dirtyValues);
    const params = new URLSearchParams(searchParams);
    params.delete('page');

    if (filter) {
      params.set('filter', encodeFilter(filter));
    } else {
      params.delete('filter');
    }

    const route = `${url}?${params.toString()}`;
    router.replace(route);
    setOpen(false);
  };

  useEffect(() => {
    const {success, data} = EncodedFilterSchema.safeParse(filter);
    if (!success || !data) {
      form.reset(defaultValues);
    } else {
      form.reset({...defaultValues, ...data});
    }
  }, [filter, form]);
  const [Controller, Trigger, Content] = small
    ? ([Drawer, DrawerTrigger, DrawerContent] as const)
    : ([Popover, PopoverTrigger, PopoverContent] as const);

  return (
    <div className={cn('relative', {'mt-5': small})}>
      <div className="flex items-center justify-between">
        <h3 className="text-base mb-2">{i18n.get('Filter')} :</h3>
      </div>
      <Controller open={open} onOpenChange={setOpen}>
        <Trigger asChild>
          <Button
            variant={filterCount ? 'default' : 'outline'}
            className={cn('flex justify-between w-[354px]', {
              ['w-full']: small,
            })}>
            <div className="flex items-center space-x-2">
              <FaFilter className="size-4" />
              <span> {i18n.get('Filters')}</span>
            </div>
            {filterCount > 0 && (
              <Badge
                className="ms-auto ps-[0.45rem] pe-2"
                variant={filterCount ? 'destructive' : 'default'}>
                {filterCount}
              </Badge>
            )}
          </Button>
        </Trigger>

        <Content className={small ? 'px-5 pb-5' : 'max-w-[22.7rem] w-74'}>
          {small && (
            <>
              <h3 className="text-xl font-semibold mb-2">
                {i18n.get('Filters')}
              </h3>
              <hr className="mb-2" />
            </>
          )}
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmit)}
              className="overflow-y-auto">
              <div className="space-y-4">
                <RequestedByField form={form} users={users} />
                <DatesField form={form} />
                <PriorityField form={form} priorities={priorities} />
                <StatusField form={form} statuses={statuses} />
                <Button variant="success" type="submit" className="w-full">
                  {i18n.get('Apply')}
                </Button>
              </div>
            </form>
          </Form>
        </Content>
      </Controller>
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
        <FormItem className="grow">
          <FormLabel>{i18n.get('Requested by')} :</FormLabel>
          <MultiSelector
            onValuesChange={field.onChange}
            values={field.value ?? []}
            className="space-y-0">
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
    <div>
      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="updatedOn.0"
          render={({field}) => (
            <FormItem className="grow">
              <FormLabel>{i18n.get('From')}:</FormLabel>
              <FormControl>
                <Input type="date" placeholder="DD/MM/YYYY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="updatedOn.1"
          render={({field}) => (
            <FormItem className="grow">
              <FormLabel>{i18n.get('To')}:</FormLabel>
              <FormControl>
                <Input type="date" placeholder="DD/MM/YYYY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {form.formState.errors.updatedOn?.root && (
        <FormMessage>
          {form.formState.errors.updatedOn.root.message}
        </FormMessage>
      )}
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
          <FormLabel>{i18n.get('Priority')} :</FormLabel>
          {priorities.map(priority => (
            <FormField
              key={priority.id}
              control={form.control}
              name="priority"
              render={({field}) => (
                <FormItem className="flex items-end">
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
  form: UseFormReturn<z.infer<typeof FilterSchema>>;
};

function StatusField(props: FieldProps & Pick<FilterProps, 'statuses'>) {
  const {form, statuses} = props;
  return (
    <FormField
      control={form.control}
      name="status"
      render={({field}) => (
        <FormItem>
          <FormLabel>{i18n.get('Status')} :</FormLabel>
          <MultiSelector
            onValuesChange={field.onChange}
            className="space-y-0"
            values={field.value ?? []}>
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
