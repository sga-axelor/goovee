'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {signIn} from 'next-auth/react';
import {FaGoogle} from 'react-icons/fa';
import {Checkbox} from '@ui/components/checkbox';
import {Label} from '@ui/components/label';
import {Button} from '@ui/components/button';
import {Separator} from '@ui/components/separator';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {TextField} from '@ui/components/TextField';

import {Toast} from '@ui/components/index';
export default function Content({canRegister}: {canRegister?: boolean}) {
  const [values, setValues] = useState({email: '', password: ''});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

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
    setError(false);

    const {email, password} = values;

    const login = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (login?.ok) {
      router.replace(redirection);
    } else {
      setError(true);
    }

    setSubmitting(false);
  };

  const loginWithGoogle = async () => {
    await signIn('google', {
      callbackUrl: redirection,
    });
  };

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-[1185px] w-full">
      <h5 className="mb-3 font-medium text-primary text-xl">{i18n.get('Log in')}</h5>
      <form
        className="bg-background rounded-lg py-4 px-6 sm:px-4 grid grid-cols-1 gap-4"
        onSubmit={handleSubmit}>
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
        {error && (
          <Toast
            variant="error"
            show={true}
            heading={i18n.get('The email or the password is wrong.')}
            description={i18n.get(
              'The description line of a sticky alert. Helpful component that is designed to be placed near to alert context.',
            )}
          />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" disabled={submitting} />
            <Label htmlFor="terms" className="ml-2 text-primary">
              {i18n.get('Remember Me')}
            </Label>
          </div>
          <Link
            href={`/auth/forgot-password?${searchQuery}`}
            aria-disabled={submitting}
            className="text-main_purple flex text-decoration-underline">
            {i18n.get('Forgot Password ?')}
          </Link>
        </div>
        <Button type="submit" disabled={submitting} className="rounded-full">
          {i18n.get('Log In')}
        </Button>
        {canRegister && (
          <div>
            <p className="text-primary inline-flex text-lg mr-2 mb-0">
              {i18n.get("Don't have an account yet ?")}
            </p>
            <Link
              href={`/auth/register?${searchQuery}`}
              aria-disabled={submitting}
              className="text-main_purple inline-flex text-decoration-underline text-lg">
              {i18n.get('Sign Up')}
            </Link>
          </div>
        )}
        {searchParams.get('success') && (
          <div className="text-success-dark">{searchParams.get('success')}</div>
        )}
      </form>
      <div className="flex items-center gap-4 mt-4">
        <div className="grow">
          <Separator />
        </div>
        <h5 className="mb-0 font-medium text-primary text-xl">{i18n.get('Or')}</h5>
        <div className="grow">
          <Separator />
        </div>
      </div>
      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-4 rounded-full w-full !border-primary !bg-background">
          <FaGoogle className="text-xl" />
          <span className="text-primary font-medium">
            {i18n.get('Log In with Google')}
          </span>
        </Button>
      </div>
    </div>
  );
}
