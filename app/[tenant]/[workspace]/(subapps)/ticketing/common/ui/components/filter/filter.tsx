'use client';

import {useRef} from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {
  Checkbox,
  Label,
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

const filterSchema = z.object({
  requestedBy: z.string().optional(),
  toDate: z.string().optional(),
  fromDate: z.string().optional(),
  priority: z.array(z.string()).optional(),
  status: z.string().optional(),
});
type FilterProps = {
  users: AOSUser[];
  priorities: AOSProjectPriority[];
  statuses: AOSProjectTaskStatus[];
};

export function Filter(props: FilterProps) {
  const {users, priorities, statuses} = props;
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      requestedBy: '',
      toDate: '',
      fromDate: '',
      priority: [],
      status: '',
    },
  });

  const onSubmit = (value: z.infer<typeof filterSchema>) => {
    //to do
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{i18n.get('Filter :')}</h3>
      </div>
      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            className="flex justify-between w-[354px] h-[47px]">
            <span className="flex items-center space-x-2">
              <FaFilter />
              <span> {i18n.get('Filter')}</span>
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-75">
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={i18n.get('Select users')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map(user => (
                <SelectItem value={user.id!} key={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <FormControl>
            <div className="space-y-2">
              {priorities.map(priority => (
                <div key={priority.id} className="flex items-center space-x-2">
                  <Checkbox onCheckedChange={field.onChange} />
                  <Label className="ml-4 text-xs">{priority.name}</Label>
                </div>
              ))}
            </div>
          </FormControl>
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
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={i18n.get('Select statuses')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem value={status.id!} key={status.id}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
