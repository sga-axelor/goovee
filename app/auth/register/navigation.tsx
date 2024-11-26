'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {Button} from '@/ui/components/button';
import {Separator} from '@/ui/components/separator';
import type {PortalWorkspace} from '@/types';

export default function Navigation({workspace}: {workspace?: PortalWorkspace}) {
  const searchParams = useSearchParams();
  const searchQuery = new URLSearchParams(searchParams).toString();

  return (
    <div className="container space-y-6 mt-8">
      <h1 className="text-[2rem] font-semibold">{i18n.get('Sign Up')}</h1>
      <div className="bg-white py-4 px-6 space-y-4">
        <Link href={`/auth/register/email?${searchQuery}`} className="w-full">
          <Button variant="success" className="w-full rounded-full">
            {i18n.get('Sign Up with email')}
          </Button>
        </Link>
        <p className="text-success">
          {i18n.get('Already have an account')} ?{' '}
          <Link href={`/auth/login?${searchQuery}`}>
            <span className="underline">{i18n.get('Log In')}</span>
          </Link>
        </p>
        <div className="flex items-center gap-4">
          <div className="grow">
            <Separator />
          </div>
          <h5 className="mb-0 font-medium text-[2rem]">{i18n.get('Or')}</h5>
          <div className="grow">
            <Separator />
          </div>
        </div>
        <Button
          type="button"
          variant="outline-success"
          className="w-full rounded-full">
          <Image
            alt="Google"
            src="/images/google.svg"
            height={24}
            width={24}
            className="me-2"
          />
          {i18n.get('Sign Up with Google')}
        </Button>
      </div>
    </div>
  );
}
