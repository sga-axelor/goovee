import Link from 'next/link';
import {notFound} from 'next/navigation';
import {IconType} from 'react-icons';
import {
  MdAllInbox,
  MdOutlineFoodBank,
  MdMoney,
  MdOutlineDiamond,
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
import {cn} from '@/utils/css';
import {getImageURL} from '@/utils/files';
import {workspacePathname} from '@/utils/workspace';

import {MdOutlineNotificationAdd} from 'react-icons/md';

// ---- LOCAL IMPORTS ---- //
import Hero from './hero';
import {Button} from '@/ui/components';
import {Card} from './common/ui/components/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/components/pagination';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {getPages, getPaginationButtons} from '../ticketing/common/utils';
import {Map} from './common/ui/components/map';
import {Sort} from './common/ui/components/sort';
import {Swipe} from './common/ui/components/swipe';
import {getTranslation} from '@/lib/core/i18n/server';
import {findDirectoryEntryList} from './common/orm/directory-entry';
import {
  findDirectoryCategories,
  findDirectoryEntries,
} from './common/orm/directory-category';
import {colors} from './common/constants';
import {getSkip} from '../ticketing/common/utils/search-param';

const markers = [
  {lat: 48.85341, lng: 2.3488},
  {lat: 48.85671, lng: 2.4475},
  {lat: 48.80671, lng: 2.4075},
];

const icons = [
  MdAllInbox,
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
    workspace,
    tenantId: tenant,
  });

  // TODO: change it to direcotory app later
  const {page = 1, limit = ITEMS_PER_PAGE} = searchParams;
  const directortyEntryList = await findDirectoryEntryList({
    take: +limit,
    skip: getSkip(limit, page),
    workspace,
    tenantId: tenant,
  });

  const entries = await findDirectoryEntries({
    workspace,
    tenantId: tenant,
  });

  const pages = getPages(directortyEntryList, limit);
  const imageURL = workspace.config.ticketHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.ticketHeroBgImage.id, tenant)})`
    : IMAGE_URL;

  const cards = categories.map((category, i) => (
    <DirectoryCards
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
        <div className="flex items-center justify-between mt-5">
          <p className="text-xl font-semibold">
            {await getTranslation('Services')}
          </p>
          <Button variant="success" className="flex items-center">
            <MdOutlineNotificationAdd className="size-6 me-2" />
            <span>{await getTranslation('Subscribe')}</span>
          </Button>
        </div>
        <Swipe
          items={cards}
          className="flex justify-center items-center mt-5 p-2 space-y-2"
        />
        <div className="flex has-[.expand]:flex-col gap-4 mt-4">
          <aside className="space-y-4">
            <Map showExpand locations={clone(entries)} />
            <Sort />
          </aside>
          <main className="grow flex flex-col gap-4">
            {directortyEntryList.map(item => (
              <Card
                item={item}
                url={`${workspaceURI}/directory/${item.id}`}
                key={item.id}
                tenant={tenant}
              />
            ))}
          </main>
        </div>
        <CardPagination
          url={`${workspaceURI}/directory`}
          pages={pages}
          searchParams={searchParams}
        />
      </div>
    </>
  );
}

type CardPaginationProps = {
  url: string;
  searchParams: {page?: number; limit?: number};
  pages: number;
};

function CardPagination({url, searchParams, pages}: CardPaginationProps) {
  const {page = 1} = searchParams;

  return (
    <Pagination className="p-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious asChild>
            <Link
              replace
              scroll={false}
              className={+page <= 1 ? 'invisible' : ''}
              href={{pathname: url, query: {...searchParams, page: +page - 1}}}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Link>
          </PaginationPrevious>
        </PaginationItem>
        {getPaginationButtons({currentPage: +page, totalPages: pages}).map(
          (value, i) =>
            typeof value === 'string' ? (
              <PaginationItem key={i}>
                <span className="pagination-ellipsis">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={value}>
                <PaginationLink isActive={+page === value} asChild>
                  <Link
                    replace
                    scroll={false}
                    href={{
                      pathname: url,
                      query: {...searchParams, page: value},
                    }}>
                    {value}
                  </Link>
                </PaginationLink>
              </PaginationItem>
            ),
        )}
        <PaginationItem>
          <PaginationNext asChild>
            <Link
              replace
              scroll={false}
              className={+page >= pages ? 'invisible' : ''}
              href={{pathname: url, query: {...searchParams, page: +page + 1}}}>
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

type DirectoryCardsProps = {
  label: string;
  icon: IconType;
  iconClassName: string;
};

function DirectoryCards(props: DirectoryCardsProps) {
  const {label, icon: Icon, iconClassName} = props;
  return (
    <Link href="">
      <div
        className={cn(
          iconClassName,
          'flex items-center justify-center  h-14 w-14 rounded-full m-auto',
        )}>
        <Icon className="h-10 w-10 " />
      </div>

      <p className="text-[0.8125rem] font-semibold text-center mt-1">{label}</p>
    </Link>
  );
}
