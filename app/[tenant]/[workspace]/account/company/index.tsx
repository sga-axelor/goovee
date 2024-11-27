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
import {Textarea} from '@/ui/components/textarea';
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
import InviteForm from './invite-form';

const formSchema = z.object({
  companyName: z.string(),
  siretNumber: z.string(),
  companyDescription: z.string(),
  email: z.string(),
  phone: z.string(),
  showCompanyOnDirectory: z.boolean(),
  showNameOnDirectory: z.boolean(),
  showAddressOnDirectory: z.boolean(),
  showEmailOnDirectory: z.boolean(),
  showPhoneOnDirectory: z.boolean(),
  showDescriptionOnDirectory: z.boolean(),
  showWebsiteOnDirectory: z.boolean(),
  showSocialLink: z.boolean(),
  websiteLink: z.string(),
  linkedInLink: z.string(),
  facebookLink: z.string(),
  xLink: z.string(),
  instagramLink: z.string(),
  allowContactToShowInDirectory: z.boolean(),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      siretNumber: '',
      companyDescription: '',
      email: '',
      phone: '',
      showCompanyOnDirectory: false,
      showNameOnDirectory: false,
      showAddressOnDirectory: false,
      showEmailOnDirectory: false,
      showPhoneOnDirectory: false,
      showDescriptionOnDirectory: false,
      showWebsiteOnDirectory: false,
      showSocialLink: false,
      websiteLink: '',
      linkedInLink: '',
      facebookLink: '',
      xLink: '',
      instagramLink: '',
      allowContactToShowInDirectory: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-10">
          <div className="space-y-4">
            <Title text={i18n.get('Company Information')} />
            <div className="space-y-4">
              <FormLabel>{i18n.get('Company picture')}</FormLabel>
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
          </div>
          <FormField
            control={form.control}
            name="companyName"
            render={({field}) => (
              <FormItem>
                <FormLabel>{i18n.get('Company name')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    placeholder={i18n.get('Enter company name')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siretNumber"
            render={({field}) => (
              <FormItem>
                <FormLabel>{i18n.get('SIRET number')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value}
                    placeholder={i18n.get('Enter company SIRET number')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyDescription"
            render={({field}) => (
              <FormItem>
                <FormLabel>{i18n.get('Company description')}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value}
                    placeholder={i18n.get('Enter company description')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <InviteForm />

          <div className="space-y-4 hidden">
            <Title text={i18n.get('Directory')}></Title>
            <div>
              <FormField
                control={form.control}
                name="showCompanyOnDirectory"
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
                        {i18n.get('Show the company on the directory')}
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
            <div className="grid grid-cols-5 gap-x-16 gap-y-4">
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
                name="showAddressOnDirectory"
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
                      <FormLabel>{i18n.get('Address')}</FormLabel>
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
                      <FormLabel>{i18n.get('Phone number')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showDescriptionOnDirectory"
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
                      <FormLabel>{i18n.get('Description')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showWebsiteOnDirectory"
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
                      <FormLabel>{i18n.get('Website')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="websiteLink"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Website link')}</FormLabel>
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
            <div>
              <FormField
                control={form.control}
                name="showSocialLink"
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
                      <FormLabel>{i18n.get('Social Media')}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <FormField
                control={form.control}
                name="xLink"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('X link')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter your x link')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebookLink"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Facebook link')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter your facebook link')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramLink"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Instagram link')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value}
                        placeholder={i18n.get('Enter your instagram link')}
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
                name="allowContactToShowInDirectory"
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
                          'Allow contacts to show in my company directory',
                        )}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="space-y-4 text-end">
            <Button variant="success">
              {i18n.get('Save Company Settings')}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
