'use client';

import {useRef, useState} from 'react';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/components/alert-dialog';
import {UserType} from '@/auth/types';
import {useToast} from '@/ui/hooks';
import {getInitials} from '@/utils/names';
import {getDownloadURL} from '@/utils/files';
import {useWorkspace} from '../../workspace-context';

// ---- LOCAL IMPORTS ---- //
import {Title} from '../common/ui/components';
import {update, updateProfileImage} from './action';
import {RoleLabel} from '../common/constants';

const formSchema = z
  .object({
    type: z.enum([UserType.company, UserType.individual]),
    firstName: z.string(),
    name: z.string(),
    email: z.string(),
    companyName: z.string(),
    identificationNumber: z.string(),
    companyNumber: z.string(),
    role: z.string(),
    showProfileAsContactOnDirectory: z.boolean(),
    showNameOnDirectory: z.boolean(),
    showLinkOnDirectory: z.boolean(),
    showEmailOnDirectory: z.boolean(),
    showPhoneOnDirectory: z.boolean(),
    linkedInLink: z.string(),
  })
  .refine(
    data => {
      if (data.type === UserType.company) {
        if (!data.companyName) return false;
      }
      return true;
    },
    {
      message: i18n.get('Company name is required'),
      path: ['companyName'],
    },
  )
  .refine(
    data => {
      if (data.type === UserType.individual) {
        if (!data.name) return false;
      }
      return true;
    },
    {
      message: i18n.get('Name is required'),
      path: ['name'],
    },
  );

export default function Personal({
  settings: {
    type,
    companyName,
    identificationNumber,
    companyNumber,
    firstName,
    name,
    email,
    picture: pictureProp,
    fullName,
    role,
  },
}: {
  settings: {
    type: UserType;
    companyName?: string;
    identificationNumber?: string;
    companyNumber?: string;
    firstName?: string;
    name: string;
    email: string;
    picture?: string;
    fullName?: string;
    role?: string;
  };
}) {
  const {toast} = useToast();
  const {tenant} = useWorkspace();
  const [confirmation, setConfirmation] = useState<any>(false);
  const [picture, setPicture] = useState<any>(pictureProp);
  const [updatingPicture, setUpdatingPicture] = useState(false);
  const pictureInputRef = useRef<any>();

  const isCompany = type === UserType.company;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type,
      companyName,
      identificationNumber: identificationNumber || '',
      companyNumber: companyNumber || '',
      firstName: firstName || '',
      name,
      email,
      role,
      showProfileAsContactOnDirectory: false,
      showNameOnDirectory: false,
      showLinkOnDirectory: false,
      showEmailOnDirectory: false,
      showPhoneOnDirectory: false,
      linkedInLink: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await update(values);

      if ('success' in res) {
        toast({
          variant: 'success',
          title: res.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: res.message,
        });
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: i18n.get('Error registering, try again'),
      });
    }
  };

  const openConfirmation = () => {
    setConfirmation(true);
  };

  const closeConfirmation = () => {
    setConfirmation(false);
  };

  const openFileUpload = () => {
    pictureInputRef?.current?.click();
  };

  const handleDeletePicture = async () => {
    closeConfirmation();
    setUpdatingPicture(true);

    const formData = new FormData();
    formData.append('picture', '');

    const result = await updateProfileImage(formData);

    if ('error' in result) {
      toast({title: result.message, variant: 'destructive'});
    } else {
      toast({
        title: i18n.get('Picture deleted successfully.'),
        variant: 'success',
      });
      setPicture(null);
    }
    setUpdatingPicture(false);
  };

  const handleUpdatePicture = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files?.[0];

    if (!file) return;

    setUpdatingPicture(true);

    const formData = new FormData();
    formData.append('picture', file);

    const result = await updateProfileImage(formData);

    if ('error' in result) {
      toast({title: result.message, variant: 'destructive'});
    } else {
      toast({
        title: i18n.get('Picture updated successfully.'),
        variant: 'success',
      });
      setPicture(result.data?.id);
    }
    setUpdatingPicture(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-10">
            <div className="space-y-4">
              <Title text={i18n.get('Profile Settings')} />
              <div className="space-y-4">
                <FormLabel>{i18n.get('Picture')}</FormLabel>
                <div className="flex items-center justify-between">
                  <div>
                    <Avatar className="size-20">
                      <AvatarImage
                        src={getDownloadURL(picture, tenant, {
                          isMeta: true,
                          noimage: true,
                          noimageSrc: '/images/profile.png',
                        })}
                      />
                      <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline-success"
                      onClick={openFileUpload}
                      disabled={updatingPicture}>
                      <MdFileUpload className="size-6" />
                      {i18n.get('Upload a picture')}
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      ref={pictureInputRef}
                      onChange={handleUpdatePicture}
                    />
                    <Button
                      variant="outline-destructive"
                      onClick={openConfirmation}
                      disabled={updatingPicture}>
                      <MdDeleteOutline className="size-6" />
                      {i18n.get('Delete')}
                    </Button>
                  </div>
                </div>
              </div>

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
                {!isCompany ? (
                  <FormField
                    control={form.control}
                    name="name"
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
                ) : (
                  <div />
                )}
              </div>
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
              {isCompany && (
                <>
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
                    name="identificationNumber"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>
                          {i18n.get('identification number')}
                        </FormLabel>
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
                    name="companyNumber"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>{i18n.get('Company number')}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value}
                            placeholder={i18n.get('Enter company number')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Role')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={(RoleLabel as any)[field.value]}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="sr-only space-y-4">
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
              <Button variant="success">{i18n.get('Save Settings')}</Button>
            </div>
          </div>
        </form>
      </Form>
      <AlertDialog open={confirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.get('Do you want to delete picture?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.get('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePicture}>
              {i18n.get('Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
