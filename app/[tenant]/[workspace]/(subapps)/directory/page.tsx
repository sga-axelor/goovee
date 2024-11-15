import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {IMAGE_URL} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';
import {getImageURL} from '@/utils/files';

// ---- LOCAL IMPORTS ---- //
import Hero from './hero';
import {Map} from './common/ui/components/map';

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
      <div className="container flex has-[.expand]:flex-col gap-4 mt-4">
        <Map />
        <div className="grow flex flex-col gap-4 ">
          {Array.from({length: 10}).map((_, index) => (
            <div
              key={index}
              className="flex justify-center items-center p-4 h-40 bg-blue-400">
              cards
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
