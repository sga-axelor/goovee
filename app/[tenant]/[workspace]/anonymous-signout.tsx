'use client';

import {useEffect} from 'react';
import {signOut} from 'next-auth/react';

export default function AnonymousSignOut({callbackurl}: {callbackurl: string}) {
  useEffect(() => {
    signOut({
      callbackUrl: callbackurl,
    });
  }, [callbackurl]);

  return null;
}
