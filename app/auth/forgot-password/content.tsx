'use client';

import React from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {Button} from '@ui/components/button';
import {Label} from '@ui/components/label';
// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {Toast} from '@/ui/components';
import {TextField} from '@ui/components/TextField';
export default function Content() {
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="mx-auto p-4 sm:p-6 max-w-[1185px] w-full">
      <h5 className="mb-3 font-medium text-primary">
        {i18n.get('Forgot Password')} ?
      </h5>
      <form
        className="bg-background rounded-lg py-4 px-6 sm:px-4 grid grid-cols-1 gap-4"
        onSubmit={handleSubmit}>
        <div>
          <TextField
            label={i18n.get('Email')}
            type="email"
            name="email"
            placeholder="Enter email"
          />
          <Button type="submit" className="rounded-full w-full">
            {i18n.get('Submit')}
          </Button>
        </div>
        <div className="flex items-center">
          <Label className="mr-2 mb-0 text-primary inline-flex">
            {i18n.get('Remember password')} ?
          </Label>
          <Link
            href={`/auth/login?${searchQuery}`}
            className="text-main_purple flex text-decoration-underline">
            {i18n.get('Log In')}
          </Link>
        </div>
        <Toast
          variant="error"
          show={true}
          heading={i18n.get('Your email has not been recognised.')}
          description={i18n.get(
            'The description line of a sticky alert. Helpful component that is designed to be placed near to alert context.',
          )}
        />
        <Toast
          variant="success"
          show={true}
          heading={i18n.get(
            'A link has been sent in your mailbox successfully.',
          )}
          description={i18n.get(
            'Sometimesit can take up to 5 minutes to receive the email. If you don’t receive anything please try again.',
          )}
        />
      </form>
    </div>
  );
}
