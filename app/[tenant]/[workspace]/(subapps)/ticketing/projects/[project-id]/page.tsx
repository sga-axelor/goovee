// ---- CORE IMPORTS ---- //
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {TicketList} from '@/subapps/ticketing/common/ui/components/ticket-list';
import Hero from './hero';
import {i18n} from '@/lib/i18n';
import {Button} from '@/ui/components';
import {MdAdd} from 'react-icons/md';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; 'project-id': string};
  searchParams: {[key: string]: string | undefined};
}) {
  const projectId = params?.['project-id'];

  const {limit, page} = searchParams;

  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  /**
   * TODO
   *
   * Fetch project tickets using
   * projectId, limit, page and other params, searchparams if required
   */

  return (
    <>
      <Hero workspace={workspace} />
      <div className="container mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            {i18n.get('Latest tickets')}
          </h2>
          <Button variant="success" className="flex items-center">
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a ticket')}</span>
          </Button>
        </div>
        <TicketList tickets={[]} />
      </div>
    </>
  );
}
