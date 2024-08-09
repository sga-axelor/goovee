import {MdAdd} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {Button, HeroSearch} from '@/ui/components';
import {workspacePathname} from '@/utils/workspace';
import {clone} from '@/utils';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();

  const {workspaceURL} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  /**
   * TODO
   *
   * Fetch projects per workspace
   */

  return (
    <>
      <HeroSearch
        title={i18n.get('Ticketing')}
        description={i18n.get(
          'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam',
        )}
        image={IMAGE_URL}
      />
      <div className="container mt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl">
            {i18n.get('Choose your project')}
          </h2>
          <Button variant="success" className="flex items-center">
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a new project')}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
