'use client';

import {useState} from 'react';
import Link from 'next/link';
import {signOut, useSession} from 'next-auth/react';
import {usePathname} from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/components/dropdown-menu';
import {MdOutlineAccountCircle} from 'react-icons/md';

export function Account({baseURL = ''}: {baseURL?: string}) {
  const pathname = usePathname();
  const encodedPathname = encodeURIComponent(pathname);
  const {data: session} = useSession();

  const loggedin = !!session;

  const handleLogout = () => {
    if (window.confirm('Do you want to logout ?')) {
      signOut({
        callbackUrl: `/auth/login?callbackurl=${encodedPathname}&workspaceURI=${encodeURIComponent(
          baseURL,
        )}`,
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MdOutlineAccountCircle className="cursor-pointer text-foreground text-2xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {loggedin ? (
            <>
              <Link
                href={`${baseURL || ''}/account`}
                className="cursor-pointer">
                <DropdownMenuItem className="cursor-pointer">
                  My Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleLogout}>
                logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <Link
                href={`/auth/login?callbackurl=${encodedPathname}&workspaceURI=${encodeURIComponent(
                  baseURL,
                )}`}>
                <DropdownMenuItem>Log In</DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default Account;
