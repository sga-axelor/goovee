import {notFound} from 'next/navigation';
import * as materialIcon from 'react-icons/md';
import {
  MdMoney,
  MdOutlineDiamond,
  MdOutlineFoodBank,
  MdOutlineMedicalServices,
  MdOutlineSmartphone,
  MdOutlineSupervisedUserCircle,
} from 'react-icons/md';
import {TbTool} from 'react-icons/tb';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {IMAGE_URL} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {getImageURL} from '@/utils/files';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {Content} from '../directory/content';
import {getPages} from '../ticketing/common/utils'; //TODO: extract ticketing imports to core everywhere
import {getSkip} from '../ticketing/common/utils/search-param';
import {colors} from './common/constants';
import {findCategories} from './common/orm/directory-category';
import {findEntries} from './common/orm/directory-entry';
import {DirectoryCards} from './common/ui/components/category-card';
import {Swipe} from './common/ui/components/swipe';
import Hero from './hero';

const icons = [
  materialIcon['MdAllInbox'],
  MdOutlineFoodBank,
  MdMoney,
  MdOutlineDiamond,
  MdOutlineMedicalServices,
  MdOutlineSmartphone,
  MdOutlineSupervisedUserCircle,
  TbTool,
];

const ITEMS_PER_PAGE = 7;

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {page?: number; limit?: number; sort?: string | undefined};
}) {
  const session = await getSession();

  // TODO: check if user auth is required
  // if (!session?.user) notFound();

  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();

  const categories = await findCategories({
    workspaceId: workspace.id,
    tenantId: tenant,
  });

  // TODO: change it to direcotory app later
  const {page = 1, limit = ITEMS_PER_PAGE, sort} = searchParams;
  const entries = await findEntries({
    sort: sort,
    take: +limit,
    skip: getSkip(limit, page),
    workspaceId: workspace.id,
    tenantId: tenant,
  });

  const pages = getPages(entries, limit);
  const imageURL = workspace.config.directoryHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.directoryHeroBgImage.id, tenant)})`
    : IMAGE_URL;

  const cards = categories.map((category, i) => (
    <DirectoryCards
      workspaceURI={workspaceURI}
      id={category.id}
      key={category.id}
      icon={icons[i] ?? MdOutlineSupervisedUserCircle}
      label={category.title ?? ''}
      iconClassName={colors[category.color as keyof typeof colors] ?? ''}
    />
  ));

  return (
    <>
      <Hero
        title={workspace.config.directoryHeroTitle}
        description={workspace.config.directoryHeroDescription}
        background={workspace.config.directoryHeroOverlayColorSelect}
        image={imageURL}
        tenantId={tenant}
      />
      <div className="container mb-5">
        {cards.length > 0 && (
          <Swipe
            items={cards}
            className="flex justify-center items-center mt-5 p-2 space-y-2"
          />
        )}
        <Content
          workspaceURI={workspaceURI}
          tenant={tenant}
          pages={pages}
          searchParams={searchParams}
          entries={clone(entries)}
        />
      </div>
    </>
  );
}
