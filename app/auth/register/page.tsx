import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {findWorkspaces} from '@/orm/workspace';
import {clone} from '@/utils';
import {getSession} from '@/auth';

// ---- LOCAL IMPORTS ---- //
import Content from './content';
import {i18n} from '@/i18n';
import {Button} from '@/ui/components';
import Link from 'next/link';

export default async function Page({
  searchParams,
}: {
  searchParams: {
    workspaceURI?: string;
    tenant: string;
  };
}) {
  const session = await getSession();
  const user = session?.user;

  const workspaceURI =
    searchParams?.workspaceURI && decodeURIComponent(searchParams.workspaceURI);

  const tenantId =
    searchParams?.tenant && decodeURIComponent(searchParams.tenant);

  if (!(workspaceURI && tenantId)) {
    return notFound();
  }

  const workspaceURL = `${process.env.NEXT_PUBLIC_HOST}${workspaceURI}`;

  let userWorkspaces = [];
  if (user) {
    userWorkspaces = await findWorkspaces({
      url: workspaceURL,
      user,
      tenantId,
    }).then(clone);
  }

  const existing = userWorkspaces.some((w: any) => w.url === workspaceURL);

  if (existing) {
    return (
      <div className="container mx-auto px-6 py-4 gap-2 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium">
          {i18n.get('You are already registered with the workspace!')}
        </h2>
        <p className="text-muted-foreground">
          {i18n.get('Workspace')} : {workspaceURL}
        </p>
        <Button asChild>
          <Link href={workspaceURL}>
            {i18n.get('Continue to the workspace')}
          </Link>
        </Button>
      </div>
    );
  }

  const workspaces = await findWorkspaces({url: workspaceURL, tenantId}).then(
    clone,
  );

  const workspace = workspaces.find((w: any) => w.url === workspaceURL);

  const canRegister = workspace?.allowRegistrationSelect === 'yes';

  if (!canRegister) {
    return notFound();
  }

  return <Content workspace={workspace} />;
}
