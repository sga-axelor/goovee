'use client';

import {useRef, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
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

const filterSchema = z.object({
  requestedBy: z.string().optional(),
  date: z.string().optional(),
  priority: z.array(z.string()).optional(),
  status: z.string().optional(),
});

export function FilterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const users = [
    {id: '1', name: 'User One'},
    {id: '2', name: 'User Two'},
  ];

  const statuses = [
    {value: 'new', label: 'New'},
    {value: 'in-progress', label: 'In Progress'},
    {value: 'resolved', label: 'Resolved'},
    {value: 'closed', label: 'Closed'},
  ];
  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      requestedBy: '',
      date: '',
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
            className="flex justify-between w-[307px] h-[47px]">
            <span className="flex items-center space-x-2">
              <FaFilter />
              <span> {i18n.get('Filter')}</span>
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Form {...form}>
            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="requestedBy"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{i18n.get('Requested by :')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={i18n.get('Select users')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user: any) => (
                            <SelectItem value={user.id} key={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{i18n.get('Dates :')}</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="JJ/MM/AAAA"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{i18n.get('Priority :')}</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          {['High', 'Medium', 'Low'].map(priority => (
                            <div
                              key={priority}
                              className="flex items-center space-x-2">
                              <Checkbox />
                              <Label className="ml-4 text-xs">{priority}</Label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>{i18n.get('Status :')}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={i18n.get('Select statuses')}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status: any) => (
                            <SelectItem value={status.value} key={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
