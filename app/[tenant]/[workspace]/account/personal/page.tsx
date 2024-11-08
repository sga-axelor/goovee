'use client';

import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {MdFileUpload, MdDeleteOutline} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Avatar, AvatarImage, AvatarFallback} from '@/ui/components/avatar';
import {Button} from '@/ui/components/button';
import {Checkbox} from '@/ui/components/checkbox';
import {Input} from '@/ui/components/input';
import {
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
  FormLabel,
  FormMessage,
} from '@/ui/components/form';

// ---- LOCAL IMPORTS ---- //
import {Title} from '../common/ui/components';

const formSchema = z.object({
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  company: z.string(),
  role: z.string(),
  defaultWorkspace: z.string(),
  showProfileAsContactOnDirectory: z.boolean(),
  showNameOnDirectory: z.boolean(),
  showLinkOnDirectory: z.boolean(),
  showEmailOnDirectory: z.boolean(),
  showPhoneOnDirectory: z.boolean(),
  linkedInLink: z.string(),
});

enum Role {
  user = 'User',
  admin = 'Admin',
}

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      role: Role.user,
      defaultWorkspace: '',
      showProfileAsContactOnDirectory: false,
      showNameOnDirectory: false,
      showLinkOnDirectory: false,
      showEmailOnDirectory: false,
      showPhoneOnDirectory: false,
      linkedInLink: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-10">
          <div className="space-y-4">
            <Title text={i18n.get('Personal Settings')} />
            <div className="space-y-4">
              <FormLabel>{i18n.get('Profile picture')}</FormLabel>
              <div className="flex items-center justify-between">
                <div>
                  <Avatar className="size-20">
                    <AvatarImage src="/images/dummy-profile.png" />
                    <AvatarFallback>GV</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline-success">
                    <MdFileUpload className="size-6" />
                    {i18n.get('Upload a picture')}
                  </Button>
                  <Button variant="outline-destructive">
                    <MdDeleteOutline className="size-6" />
                    {i18n.get('Delete')}
                  </Button>
                </div>
              </div>
            </div>
            <FormField
              control={form.control}
              name="userName"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Username')}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder={i18n.get('Enter username')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('First name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter first Name')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Last name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter Last Name')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Email')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter email')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Phone')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter phone')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="company"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Company')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter company')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="role"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Role')}</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="defaultWorkspace"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Default Workspace')}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={i18n.get(
                              'Select your default workspace',
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[].map((workspace: any) => (
                          <SelectItem
                            value={workspace.id?.toString()}
                            key={workspace.id}>
                            {workspace.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-4">
            <Title text={i18n.get('Directory')}></Title>
            <div>
              <FormField
                control={form.control}
                name="showProfileAsContactOnDirectory"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-6 space-y-0">
                    <FormControl>
                      <Checkbox
                        variant="success"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {i18n.get(
                          'Show my profile as a contact for my company on the portal directory',
                        )}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <p className="font-medium text-base">
                {i18n.get('Informations displayed in the directory:')}
              </p>
            </div>
            <div className="flex gap-16">
              <FormField
                control={form.control}
                name="showNameOnDirectory"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-6 space-y-0">
                    <FormControl>
                      <Checkbox
                        variant="success"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{i18n.get('Name')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showLinkOnDirectory"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-6 space-y-0">
                    <FormControl>
                      <Checkbox
                        variant="success"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{i18n.get('LinkedIn')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showEmailOnDirectory"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-6 space-y-0">
                    <FormControl>
                      <Checkbox
                        variant="success"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{i18n.get('Email')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showPhoneOnDirectory"
                render={({field}) => (
                  <FormItem className="flex flex-row items-center space-x-6 space-y-0">
                    <FormControl>
                      <Checkbox
                        variant="success"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{i18n.get('Phone')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="linkedInLink"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('LinkedIn link')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter your linkedin link')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-4 text-end">
            <Button variant="success">
              {i18n.get('Save Personal Settings')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
