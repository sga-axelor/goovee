import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {i18n} from '@/i18n';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {FaLinkedin} from 'react-icons/fa';
import {Avatar, AvatarImage} from '@/ui/components';
import {getProfilePic} from '@/utils/files';

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
      <div className="flex flex-col gap-4 bg-card p-4">
        <Details />
        <Map className="h-80 w-full" markers={markers} />
      </div>
      <div className="bg-card p-4">
        <Contacts tenant={tenant} />
      </div>
    </div>
  );
}

function Details() {
  return <div>Details</div>;
}

function Contacts({tenant}: {tenant: string}) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">{i18n.get('Contact')}</h2>
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            className="object-cover"
            src={getProfilePic('', tenant)}
          />
        </Avatar>
        <span className="font-semibold">Alfredo Keebler</span>
      </div>
      <div className="ms-4 space-y-4">
        <h4 className="font-semibold">{i18n.get('Email')}</h4>
        <a
          className="text-sm text-muted-foreground"
          href="mailto:alfredo.keebler@example.com">
          alfredo.keebler@example.com
        </a>
        <h4 className="font-semibold">{i18n.get('Phone')}</h4>
        <a className="text-sm text-muted-foreground" href="tel:+1-202-555-0170">
          +1 (202) 555-0170
        </a>
        <FaLinkedin className="h-8 w-8 text-blue-700" />
      </div>
    </div>
  );
}
