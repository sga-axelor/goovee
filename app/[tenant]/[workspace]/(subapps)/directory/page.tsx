// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {IMAGE_URL} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {notFound} from 'next/navigation';

// ---- LOCAL IMPORTS ---- //
import {getImageURL} from '@/utils/files';
import Hero from './hero';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const session = await getSession();
  if (!session?.user) notFound();

  const {workspaceURL, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();

  // TODO: change it to direcotory app later
  const imageURL = workspace.config.ticketHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.ticketHeroBgImage.id, tenant)})`
    : IMAGE_URL;

  return (
    <>
      <Hero
        title={workspace.config.ticketHeroTitle}
        description={workspace.config.ticketHeroDescription}
        background={workspace.config.ticketHeroOverlayColorSelect}
        image={imageURL}
        tenantId={tenant}
      />
    </>
  );
}
