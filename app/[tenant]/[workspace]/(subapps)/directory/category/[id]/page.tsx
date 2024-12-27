import {notFound} from 'next/navigation';
import * as materialIcon from 'react-icons/md';
import {
  MdMoney,
  MdOutlineDiamond,
  MdOutlineFoodBank,
  MdOutlineMedicalServices,
  MdOutlineNotificationAdd,
  MdOutlineSmartphone,
  MdOutlineSupervisedUserCircle,
} from 'react-icons/md';
import {TbTool} from 'react-icons/tb';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {getTranslation} from '@/lib/core/i18n/server';
import {findWorkspace} from '@/orm/workspace';
import {Button} from '@/ui/components';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //

import {getPages} from '../../../ticketing/common/utils';
import {colors} from '../../common/constants';
import {findCategory} from '../../common/orm';
import {findEntries} from '../../common/orm/directory-entry';
import {DirectoryCards} from '../../common/ui/components/category-card';
import {Swipe} from '../../common/ui/components/swipe';
import {Content} from '../../content';

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
const ITEMS_PER_PAGE = 5;
export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string; id: string};
  searchParams: {page?: number; limit?: number};
}) {
  const session = await getSession();

  // TODO: check if user auth is required
  // if (!session?.user) notFound();

  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);
  const {page = 1, limit = ITEMS_PER_PAGE} = searchParams;

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
    tenantId: tenant,
  }).then(clone);

  if (!workspace) notFound();
  const {id} = params;

  const category = await findCategory({
    id,
    workspaceId: workspace.id,
    tenantId: tenant,
  });
  if (!category) notFound();

  const entries = await findEntries({
    categoryId: id,
    workspaceId: workspace.id,
    tenantId: tenant,
  });

  const pages = getPages(entries, limit);
  const cards = category.directoryCategorySet?.map((category, i) => (
    <DirectoryCards
      workspaceURI={workspaceURI}
      id={category.id}
      key={category.id}
      icon={icons[i] ?? materialIcon.MdOutlineSupervisedUserCircle}
      label={category.title ?? ''}
      iconClassName={colors[category.color as keyof typeof colors] ?? ''}
    />
  ));

  return (
    <>
      <div className="container mb-5">
        <div className="flex items-center justify-between mt-5">
          <p className="text-xl font-semibold">
            {await getTranslation(category.title!)}
          </p>
          <Button variant="success" className="flex items-center">
            <MdOutlineNotificationAdd className="size-6 me-2" />
            <span>{await getTranslation('Subscribe')}</span>
          </Button>
        </div>
        {cards && cards?.length > 0 && (
          <Swipe
            items={cards}
            className="flex justify-center items-center mt-5 p-2 space-y-2"
          />
        )}
        <Content
          workspaceURI={workspaceURI}
          entries={entries}
          tenant={tenant}
          pages={pages}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}
