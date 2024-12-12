'use client';

import {useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {MdOutlineVisibility, MdOutlineVisibilityOff} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {useToast} from '@/ui/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {Button} from '@/ui/components/button';
import {Input} from '@/ui/components/input';
import {SEARCH_PARAMS} from '@/constants';

// ---- LOCAL IMPORTS ----//
import {register} from './action';

const formSchema = z
  .object({
    firstName: z.string(),
    name: z.string().min(1, {message: i18n.get('Last name is required.')}),
    email: z.string().min(1, {message: i18n.get('Email is required')}),
    password: z.string().min(1, {message: i18n.get('Password is required')}),
    confirmPassword: z
      .string()
      .min(1, {message: i18n.get('Confirm password is required')}),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: i18n.get("Passwords don't match"),
    path: ['confirmPassword'],
  });

export default function SignUp({
  email,
  inviteId,
}: {
  email: string;
  inviteId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      name: '',
      email,
      password: '',
      confirmPassword: '',
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();
  const tenantId = searchParams.get(SEARCH_PARAMS.TENANT_ID);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {toast} = useToast();

  const toggleShowPassword = () => setShowPassword(show => !show);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(show => !show);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!email) {
      toast({
        title: i18n.get('Email is required.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const res: any = await register({
        ...values,
        tenantId,
        inviteId,
      });

      if (res.success) {
        toast({
          variant: 'success',
          title: i18n.get('Registration successfully done.'),
        });

        router.push(`/auth/login${res?.data?.query}`);
      } else if (res.error) {
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

  return (
    <div className="container space-y-6 mt-8">
      <h1 className="text-[2rem] font-bold">{i18n.get('Sign Up')}</h1>
      <div className="bg-white py-4 px-6 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-xl font-medium">
              {i18n.get('Personal information')}
            </h2>

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
                name="name"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>{i18n.get('Last name')} *</FormLabel>
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

            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Email')}*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      placeholder={i18n.get('Enter email')}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Password')}*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 border border-input px-3 py-2">
                      <Input
                        {...field}
                        className="h-auto border-0 ring-0 py-0 px-0 focus-visible:ring-transparent"
                        type={showPassword ? 'text' : 'password'}
                        value={field.value}
                        placeholder={i18n.get('Enter password')}
                      />
                      {showPassword ? (
                        <MdOutlineVisibility
                          className="size-6 text-muted cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      ) : (
                        <MdOutlineVisibilityOff
                          className="size-6 text-muted cursor-pointer"
                          onClick={toggleShowPassword}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({field}) => (
                <FormItem>
                  <FormLabel>{i18n.get('Confirm Password')}*</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 border border-input px-3 py-2">
                      <Input
                        {...field}
                        className="h-auto border-0 ring-0 py-0 px-0 focus-visible:ring-transparent"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={field.value}
                        placeholder={i18n.get('Enter password')}
                      />
                      {showConfirmPassword ? (
                        <MdOutlineVisibility
                          className="size-6 text-muted cursor"
                          onClick={toggleShowConfirmPassword}
                        />
                      ) : (
                        <MdOutlineVisibilityOff
                          className="size-6 text-muted cursor"
                          onClick={toggleShowConfirmPassword}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="success" className="w-full">
              {i18n.get('Sign Up')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
