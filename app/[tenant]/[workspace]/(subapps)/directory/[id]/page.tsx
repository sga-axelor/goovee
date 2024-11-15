import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {Map} from '../common/ui/components/map';

const markers = [{lat: 48.85341, lng: 2.3488}];
export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string; id: string};
}) {
  const session = await getSession();
  const {id} = params;

  // TODO: check if user auth is required
  // if (!session?.user) notFound();

  const {workspaceURL, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();

  return (
    <div className="container flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-4 bg-card p-2">
        <Details />
        <Map className="h-80 w-full" markers={markers} />
      </div>
      <div className="bg-card p-2">
        <Contacts />
      </div>
    </div>
  );
}

function Details() {
  return <div>Details</div>;
}

function Contacts() {
  return <div>Contacts</div>;
}
