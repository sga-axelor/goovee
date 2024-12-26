import {notFound} from 'next/navigation';
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
import * as materialIcon from 'react-icons/md';
import Content from '../directory/content';
import {getPages} from '../ticketing/common/utils';
import {getSkip} from '../ticketing/common/utils/search-param';
import {colors} from './common/constants';
import {findDirectoryCategories} from './common/orm/directory-category';
import {findDirectoryEntryList} from './common/orm/directory-entry';
import {DirectoryCards} from './common/ui/components/category-card';
import {Swipe} from './common/ui/components/swipe';
import Hero from './hero';
const markers = [
  {lat: 48.85341, lng: 2.3488},
  {lat: 48.85671, lng: 2.4475},
  {lat: 48.80671, lng: 2.4075},
];

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

const ITEMS_PER_PAGE = 3;

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {page?: number; limit?: number};
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

  const categories = await findDirectoryCategories({
    workspaceId: workspace.id,
    tenantId: tenant,
  });

  // TODO: change it to direcotory app later
  const {page = 1, limit = ITEMS_PER_PAGE} = searchParams;
  const directortyEntryList = await findDirectoryEntryList({
    take: +limit,
    skip: getSkip(limit, page),
    workspaceId: workspace.id,
    tenantId: tenant,
  });

  const pages = getPages(directortyEntryList, limit);
  const imageURL = workspace.config.ticketHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.ticketHeroBgImage.id, tenant)})`
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
        title={workspace.config.ticketHeroTitle}
        description={workspace.config.ticketHeroDescription}
        background={workspace.config.ticketHeroOverlayColorSelect}
        image={imageURL}
        tenantId={tenant}
      />
      <div className="container mb-5">
        <Swipe
          items={cards}
          className="flex justify-center items-center mt-5 p-2 space-y-2"
        />
        <Content
          workspaceURI={workspaceURI}
          directortyEntryList={directortyEntryList}
          tenant={tenant}
          pages={pages}
          searchParams={searchParams}
          entries={directortyEntryList}
        />
      </div>
    </>
  );
}
