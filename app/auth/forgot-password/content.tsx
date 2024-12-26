'use client';

import React from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/components/form';
import {Input} from '@/ui/components/input';
import {Label} from '@/ui/components/label';
import {Button} from '@/ui/components/button';
import {SEARCH_PARAMS} from '@/constants';
import {useToast} from '@/ui/hooks';
import {forgotPassword} from './action';

const formSchema = z.object({
  email: z.string().email().min(1, 'Email is required'),
});

export default function Content() {
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();
  const tenantId = searchParams.get(SEARCH_PARAMS.TENANT_ID);

  const {toast} = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res: any = await forgotPassword({
      email: values.email,
      tenantId: tenantId!,
      searchQuery,
    });
    if (res.success) {
      toast({
        variant: 'success',
        title: res.message,
      });
      router.push(`/auth/login?${searchQuery}`);
    } else if (res.error) {
      toast({
        variant: 'destructive',
        title: res.message,
      });
    }
  };

  return (
    <div className="container space-y-6 mt-8">
      <h1 className="text-[2rem] font-bold">{i18n.get('Forgot Password')}</h1>
      <div className="bg-white py-4 px-6 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="success" className="w-full">
              {i18n.get('Submit')}
            </Button>
          </form>
        </Form>

        <div className="flex items-center">
          <Label className="mr-2 mb-0 inline-flex">
            {i18n.get('Remember password')} ?
          </Label>
          <Link href={`/auth/login?${searchQuery}`} className="text-success">
            {i18n.get('Log In')}
          </Link>
        </div>
      </div>
    </div>
  );
}
