'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {signIn} from 'next-auth/react';
import Image from 'next/image';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {TextField, Checkbox, Label, Button, Separator} from '@/ui/components';
import {SEARCH_PARAMS} from '@/constants';
import {useToast} from '@/ui/hooks';

// ---- LOCAL IMPORTS ---- //
import {revalidate} from './actions';

export default function Content({canRegister}: {canRegister?: boolean}) {
  const [values, setValues] = useState({email: '', password: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {toast} = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();
  const tenantId = searchParams.get(SEARCH_PARAMS.TENANT_ID);

  const toggleShowPassword = () => setShowPassword(show => !show);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setValues(v => ({...v, [name]: value}));
  };

  const callbackurl = searchParams.get('callbackurl');

  const redirection = callbackurl ? decodeURIComponent(callbackurl) : '/';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);

    const {email, password} = values;

    const login = await signIn('credentials', {
      email,
      password,
      tenantId,
      redirect: false,
    });

    if (login?.ok) {
      await revalidate();
      router.replace(redirection);
    } else {
      toast({
        title: i18n.get('Login unsuccessful, Try again'),
        variant: 'destructive',
      });
    }

    setSubmitting(false);
  };

  const loginWithGoogle = async () => {
    await signIn('google', {
      callbackUrl: `/auth/login/google?${searchQuery}`,
    });
  };

  return (
    <div className="container space-y-6 mt-8">
      <h1 className="text-[2rem] font-bold">{i18n.get('Log In')}</h1>
      <div className="bg-white py-4 px-6 space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <TextField
              label={i18n.get('Email')}
              type="email"
              name="email"
              placeholder={i18n.get('Enter email')}
              disabled={submitting}
              value={values.email}
              onChange={handleChange}
            />
            <TextField
              label={i18n.get('Password')}
              placeholder={i18n.get('Password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              icons={[
                {
                  icon: showPassword
                    ? 'MdOutlineVisibility'
                    : 'MdOutlineVisibilityOff',
                  onClick: toggleShowPassword,
                },
              ]}
              disabled={submitting}
              value={values.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox variant="success" id="terms" disabled={submitting} />
              <Label htmlFor="terms" className="ml-2">
                {i18n.get('Remember Me')}
              </Label>
            </div>
            <Link
              href={`/auth/forgot-password?${searchQuery}`}
              aria-disabled={submitting}
              className="flex underline text-success">
              {i18n.get('Forgot Password ?')}
            </Link>
          </div>
          <Button
            variant="success"
            type="submit"
            disabled={submitting}
            className="rounded-full w-full">
            {i18n.get('Log In')}
          </Button>
          {canRegister && (
            <div className="text-success">
              <p className="inline-flex text-lg mr-2 mb-0">
                {i18n.get("Don't have an account yet ?")}
              </p>
              <Link
                href={`/auth/register?${searchQuery}`}
                aria-disabled={submitting}
                className="inline-flex underline text-lg">
                {i18n.get('Sign Up')}
              </Link>
            </div>
          )}
          {searchParams.get('success') && (
            <div className="text-success-dark">
              {searchParams.get('success')}
            </div>
          )}
        </form>
        <div className="flex items-center gap-4 mt-4">
          <div className="grow">
            <Separator />
          </div>
          <h5 className="mb-0 font-medium text-xl">{i18n.get('Or')}</h5>
          <div className="grow">
            <Separator />
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="button"
            variant="outline-success"
            className="w-full rounded-full"
            onClick={loginWithGoogle}>
            <Image
              alt="Google"
              src="/images/google.svg"
              height={24}
              width={24}
              className="me-2"
            />
            {i18n.get('Log In with Google')}
          </Button>
        </div>
      </div>
    </div>
  );
}
