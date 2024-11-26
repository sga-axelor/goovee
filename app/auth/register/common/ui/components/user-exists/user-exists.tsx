'use client';

import Link from 'next/link';

// ---- CORE IMPORTS ----//
import {i18n} from '@/i18n';
import {Button} from '@/ui/components/button';

export function UserExists({workspaceURL}: {workspaceURL: string}) {
  return (
    <div className="container mx-auto px-6 py-4 gap-2 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-xl font-medium">
        {i18n.get('You are already registered with the workspace!')}
      </h2>
      <p className="text-muted-foreground">
        {i18n.get('Workspace')} : {workspaceURL}
      </p>
      <Button asChild>
        <Link href={workspaceURL}>{i18n.get('Continue to the workspace')}</Link>
      </Button>
    </div>
  );
}

export default UserExists;
