'use client';

import {useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {signOut, useSession} from 'next-auth/react';
import {MdOutlineAccountCircle} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/ui/components';
import type {ID} from '@/types';
import {SEARCH_PARAMS} from '@/constants';

export function Account({
  baseURL = '',
  tenant,
}: {
  baseURL?: string;
  tenant?: ID | null;
}) {
  const pathname = usePathname();
  const encodedPathname = encodeURIComponent(pathname);
  const {data: session} = useSession();
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  const openConfirmation = () => {
    setConfirmationDialog(true);
  };

  const closeConfirmation = () => {
    setConfirmationDialog(false);
  };

  const loggedin = !!session;

  const handleLogout = () => {
    signOut({
      callbackUrl: `/auth/login?callbackurl=${encodedPathname}&workspaceURI=${encodeURIComponent(
        baseURL,
      )}${tenant ? `&${SEARCH_PARAMS.TENANT_ID}=${encodeURIComponent(tenant)}` : ''}`,
    });
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
                onClick={openConfirmation}>
                logout
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <Link
                href={`/auth/login?callbackurl=${encodedPathname}&workspaceURI=${encodeURIComponent(
                  baseURL,
                )}${tenant ? `&${SEARCH_PARAMS.TENANT_ID}=${encodeURIComponent(tenant)}` : ''}`}>
                <DropdownMenuItem>Log In</DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirmationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {i18n.get('Do you want to logout?')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeConfirmation}>
              {i18n.get('Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              {i18n.get('Continue')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default Account;
