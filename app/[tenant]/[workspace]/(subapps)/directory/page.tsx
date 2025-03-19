import {notFound} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {getSession} from '@/auth';
import {IMAGE_URL, SUBAPP_CODES} from '@/constants';
import {findWorkspace} from '@/orm/workspace';
import {clone} from '@/utils';
import {workspacePathname} from '@/utils/workspace';

// ---- LOCAL IMPORTS ---- //
import {colors} from './common/constants';
import {findCategories} from './common/orm/directory-category';
import {findEntries} from './common/orm/directory-entry';
import type {SearchParams} from './common/types';
import {CategoryCard} from './common/ui/components/category-card';
import {Swipe} from './common/ui/components/swipe';
import {getOrderBy, getPages, getSkip} from './common/utils';
import {Content} from './content';
import Hero from './hero';

const ITEMS_PER_PAGE = 7;

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: SearchParams;
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

  const {page = 1, limit = ITEMS_PER_PAGE, sort} = searchParams;

  const [categories, entries] = await Promise.all([
    findCategories({
      workspaceId: workspace.id,
      tenantId: tenant,
    }),
    findEntries({
      orderBy: getOrderBy(sort),
      take: +limit,
      skip: getSkip(limit, page),
      workspaceId: workspace.id,
      tenantId: tenant,
    }),
  ]);

  const pages = getPages(entries, limit);
  const imageURL = workspace.config?.directoryHeroBgImage?.id
    ? `url(${`${workspaceURL}/${SUBAPP_CODES.directory}/api/hero/background`})`
    : IMAGE_URL;

  const cards = categories.map(category => (
    <CategoryCard
      workspaceURI={workspaceURI}
      id={category.id}
      key={category.id}
      icon={category.icon}
      label={category.title ?? ''}
      iconClassName={colors[category.color as keyof typeof colors] ?? ''}
    />
  ));

  return (
    <>
      <Hero
        title={workspace.config?.directoryHeroTitle}
        description={workspace.config?.directoryHeroDescription}
        background={workspace.config?.directoryHeroOverlayColorSelect}
        image={imageURL}
      />
      <div className="container mb-5">
        {cards.length > 0 && (
          <Swipe
            items={cards}
            className="flex justify-center items-center mt-5 p-2 space-y-2 hover:bg-slate-100 hover:shadow-md transition-all duration-300"
          />
        )}
        <Content
          url={`${workspaceURI}/directory`}
          workspaceURI={workspaceURI}
          workspaceId={workspace.id}
          workspaceURL={workspaceURL}
          tenant={tenant}
          pages={pages}
          searchParams={searchParams}
          entries={entries}
        />
      </div>
    </>
  );
}
