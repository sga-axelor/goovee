'use client';

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
import {useRouter} from 'next/navigation';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useForm, UseFormReturn} from 'react-hook-form';
import {FaFilter} from 'react-icons/fa';
import {z} from 'zod';

import {ASSIGNMENT} from '../../../constants';
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

type Relational = {
  id: string;
  name: string;
  version: string;
};

type FilterProps = {
  url: string;
  searchParams: SearchParams;
  contacts: Relational[];
  priorities: Relational[];
  statuses: Relational[];
  company?: Relational;
};

const COMPANY = 'company';

const defaultValues = {
  requestedBy: [] as string[],
  assignedTo: [] as string[],
  updatedOn: ['', ''] as [string, string],
  priority: [] as string[],
  status: [] as string[],
  myTickets: false,
  assignment: null,
};

// NOTE: Steps to add more filters
// 1. Define the field in filter schema
// 2. Add a defualt value
// 3. Connect the form field
// 4. Add the where clause in getWhere function

export function Filter(props: FilterProps) {
  const {contacts, priorities, statuses, url, searchParams, company} = props;
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
  const small = (['xs', 'sm', 'md'] as const).some(x => res[x]);

  const form = useForm<z.infer<typeof FilterSchema>>({
    resolver: zodResolver(FilterSchema),
    defaultValues,
  });

  const onSubmit = (value: z.infer<typeof FilterSchema>) => {
    const filter = EncodedFilterSchema.parse(value);
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
            variant={filterCount ? 'success' : 'outline'}
            className={cn('flex justify-between w-[400px]', {
              ['w-full']: small,
            })}>
            <div className="flex items-center space-x-2">
              <FaFilter className="size-4" />
              <span> {i18n.get('Filters')}</span>
            </div>
            {filterCount > 0 && (
              <Badge
                className="ms-auto ps-[0.45rem] pe-2"
                variant="success-inverse">
                {filterCount}
              </Badge>
            )}
          </Button>
        </Trigger>

        <Content className={small ? 'px-5 pb-5' : 'w-[400px]'}>
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
              <div className="space-y-4 pr-2 pl-2">
                <MyTicketsField form={form} />
                {!form.watch('myTickets') && (
                  <>
                    <RequestedByField form={form} contacts={contacts} />
                    <AssignedToField
                      form={form}
                      contacts={contacts}
                      company={company}
                    />
                  </>
                )}
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

function AssignedToField(
  props: FieldProps & Pick<FilterProps, 'contacts' | 'company'>,
) {
  const {form, contacts, company} = props;
  const assignment = form.watch('assignment');
  return (
    <FormField
      control={form.control}
      name="assignedTo"
      render={({field}) => (
        <FormItem className="grow">
          <FormLabel>{i18n.get('Assigned to')} :</FormLabel>
          <MultiSelector
            onValuesChange={values => {
              if (values.includes(COMPANY)) {
                form.setValue('assignment', ASSIGNMENT.PROVIDER);
              } else {
                form.setValue('assignment', null);
              }
              field.onChange(values.filter(id => id !== COMPANY));
            }}
            values={
              assignment === ASSIGNMENT.PROVIDER
                ? (field.value ?? []).concat(COMPANY)
                : field.value ?? []
            }
            className="space-y-0">
            <MultiSelectorTrigger
              renderLabel={value =>
                value === COMPANY
                  ? company?.name
                  : contacts.find(contact => contact.id === value)?.name
              }>
              <MultiSelectorInput placeholder="Select users" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {company?.id && (
                  <MultiSelectorItem value={COMPANY}>
                    <div className="flex items-center space-x-2">
                      <span>{company.name}</span>
                    </div>
                  </MultiSelectorItem>
                )}
                {contacts.map(contact => (
                  <MultiSelectorItem key={contact.id} value={contact.id}>
                    <div className="flex items-center space-x-2">
                      <span>{contact.name}</span>
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
function RequestedByField(props: FieldProps & Pick<FilterProps, 'contacts'>) {
  const {form, contacts} = props;
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
                contacts.find(contact => contact.id === value)?.name
              }>
              <MultiSelectorInput placeholder="Select users" />
            </MultiSelectorTrigger>
            <MultiSelectorContent>
              <MultiSelectorList>
                {contacts.map(contact => (
                  <MultiSelectorItem key={contact.id} value={contact.id}>
                    <div className="flex items-center space-x-2">
                      <span>{contact.name}</span>
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

function MyTicketsField(props: FieldProps) {
  const {form} = props;
  return (
    <FormField
      control={form.control}
      name="myTickets"
      render={({field}) => (
        <FormItem className="flex items-center space-y-0">
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={v => {
                if (v) {
                  form.unregister(['assignedTo', 'requestedBy']);
                }
                field.onChange(v);
              }}
            />
          </FormControl>
          <FormLabel className="ms-4 text-xs">
            {i18n.get('My Tickets')}
          </FormLabel>
        </FormItem>
      )}
    />
  );
}

function DatesField(props: FieldProps) {
  const {form} = props;
  return (
    <div>
      <div className="md:flex gap-2 block">
        <FormField
          control={form.control}
          name="updatedOn.0"
          render={({field}) => (
            <FormItem className="grow">
              <FormLabel>{i18n.get('From')} :</FormLabel>
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
              <FormLabel>{i18n.get('To')} :</FormLabel>
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
                <FormItem className="flex items-center space-y-0">
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
