'use client';

import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// ---- CORE IMPORTS ---- //
import {SUBAPP_CODES} from '@/constants';
import {i18n} from '@/i18n';
import {Button} from '@/ui/components/button';
import {Input} from '@/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/components/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {RadioGroup, RadioGroupItem} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import {Title} from '../../common/ui/components';

enum Role {
  user = 'user',
  admin = 'admin',
}

enum Authorization {
  restricted = 'restricted',
  total = 'total',
}

const subappConfig = {
  [SUBAPP_CODES.shop]: {
    label: 'Shop',
    code: SUBAPP_CODES.shop,
    authorization: false,
  },
  [SUBAPP_CODES.quotations]: {
    label: 'Quotations',
    code: SUBAPP_CODES.quotations,
    authorization: true,
  },
  [SUBAPP_CODES.orders]: {
    label: 'Orders',
    code: SUBAPP_CODES.orders,
    authorization: true,
  },
  [SUBAPP_CODES.invoices]: {
    label: 'Invoices',
    code: SUBAPP_CODES.invoices,
    authorization: true,
  },
  [SUBAPP_CODES.resources]: {
    label: 'Resources',
    code: SUBAPP_CODES.resources,
    authorization: false,
  },
  [SUBAPP_CODES.news]: {
    label: 'News',
    code: SUBAPP_CODES.news,
    authorization: false,
  },
  [SUBAPP_CODES.events]: {
    label: 'Events',
    code: SUBAPP_CODES.events,
    authorization: false,
  },
  [SUBAPP_CODES.forum]: {
    label: 'Forum',
    code: SUBAPP_CODES.forum,
    authorization: false,
  },
  [SUBAPP_CODES.ticketing]: {
    label: 'Ticketing',
    code: SUBAPP_CODES.ticketing,
    authorization: true,
  },
};

const formSchema = z.object({
  emails: z.string().min(1, i18n.get('Emails cannot be empty')),
  role: z.enum([Role.user, Role.admin]),
  apps: z.record(
    z.string(),
    z.object({
      code: z.string(),
      access: z.string(),
      authorization: z
        .enum([Authorization.restricted, Authorization.total])
        .optional(),
    }),
  ),
});

export default function InviteForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: '',
      role: Role.user,
      apps: Object.values(subappConfig).reduce(
        (acc, {label, code, authorization}) => ({
          ...acc,
          [code]: {
            code,
            access: 'no',
            ...(authorization
              ? {
                  authorization: Authorization.restricted,
                }
              : {}),
          },
        }),
        {},
      ),
    },
  });

  const onInviteSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form
        className="space-y-10"
        onSubmit={event => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit(onInviteSubmit)();
        }}>
        <div className="space-y-4">
          <Title text={i18n.get('Invite new members')}></Title>
          <div className="space-y-2">
            <p className="text-base">{i18n.get('Invite contact')}</p>
            <small className="text-xs">
              {i18n.get(
                'The contact you invite must be people from your company as their account will be linked to your company.',
              )}
            </small>
            <FormField
              control={form.control}
              name="emails"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2 py-2 px-3 border rounded-lg">
                      <Input
                        {...field}
                        className="border-0 ring-0 py-0 px-0 focus-visible:ring-transparent"
                        value={field.value}
                        placeholder={i18n.get(
                          'Please write the emails of the people you want to invite on the portal',
                        )}></Input>
                      <Button size="sm" type="submit" variant="success">
                        {i18n.get('Invite')}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({field}) => (
              <FormItem>
                <FormLabel>{i18n.get('Role')}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-16">
                    <FormItem className="flex items-center space-x-6 space-y-0">
                      <FormControl>
                        <RadioGroupItem variant="success" value="admin" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {i18n.get('Admin')}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-6 space-y-0">
                      <FormControl>
                        <RadioGroupItem variant="success" value="user" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {i18n.get('User')}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.getValues('role') === 'user' && (
          <div className="flex flex-col p-2 rounded-lg gap-2">
            <div className="grid grid-cols-[20%_20%_20%] p-4 gap-6 border-b">
              <p className="text-base font-bold">App</p>
              <p className="text-base font-bold">Access</p>
              <p className="text-base font-bold">Authorization</p>
            </div>
            {Object.values(subappConfig).map(({code, label, authorization}) => (
              <div
                key={code}
                className="grid grid-cols-[20%_20%_20%] p-4 gap-6 border-b">
                <p>{label}</p>
                <div>
                  <FormField
                    control={form.control}
                    name={`apps.${code}.access`}
                    render={({field}) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={i18n.get('Select access')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              {label: 'Yes', value: 'yes'},
                              {label: 'No', value: 'no'},
                            ].map((option: any) => (
                              <SelectItem
                                value={option.value}
                                key={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {authorization && (
                  <FormField
                    control={form.control}
                    name={`apps.${code}.authorization`}
                    render={({field}) => (
                      <FormItem>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          defaultValue={Authorization.restricted}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={i18n.get('Select authorization')}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              {
                                label: 'Restricted',
                                value: Authorization.restricted,
                              },
                              {
                                label: 'Total',
                                value: Authorization.total,
                              },
                            ].map((option: any) => (
                              <SelectItem
                                value={option.value}
                                key={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </form>
    </Form>
  );
}
