'use client';

import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

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
import {fetchUpdatedSession, registerByGoogle} from '../action';

const formSchema = z.object({
  firstName: z.string(),
  name: z.string().min(1, {message: i18n.get('Last name is required.')}),
});

export default function SignUp({
  email,
  inviteId,
  updateSession,
}: {
  email: string;
  inviteId: string;
  updateSession: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      name: '',
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get(SEARCH_PARAMS.TENANT_ID);

  const {toast} = useToast();
  const {update} = useSession();

  const handleUpdateSession = async () => {
    if (tenantId) {
      const session = await fetchUpdatedSession({tenantId});
      if (session) {
        await update(session);
        router.refresh();
      }
    }
  };

  useEffect(() => {
    if (updateSession) handleUpdateSession();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!tenantId) {
      toast({
        title: i18n.get('TenantId is required.'),
        variant: 'destructive',
      });
      return;
    }

    try {
      const res: any = await registerByGoogle({
        ...values,
        tenantId,
        inviteId,
      });

      await handleUpdateSession();

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

            <Button variant="success" className="w-full rounded-full">
              {i18n.get('Sign Up')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
