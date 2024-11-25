// ---- CORE IMPORTS ---- //
import {IMAGE_URL} from '@/constants';
import {getTranslation} from '@/i18n/server';
import {HeroSearch} from '@/ui/components';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/components/pagination';
import {cn} from '@/utils/css';
import {workspacePathname} from '@/utils/workspace';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import {notFound, redirect} from 'next/navigation';

// ---- LOCAL IMPORTS ---- //
import {getImageURL} from '@/utils/files';
import {findProjectsWithTaskCount} from './common/orm/projects';
import {getPages, getPaginationButtons} from './common/utils';
import {ensureAuth} from './common/utils/auth-helper';
import {getSkip} from './common/utils/search-param';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {[key: string]: string | undefined};
}) {
  const {workspaceURL, workspaceURI, tenant} = workspacePathname(params);

  const {limit = 8, page = 1} = searchParams;
  const {error, info} = await ensureAuth(workspaceURL, tenant);
  if (error) notFound();
  const {auth, workspace} = info;

  const projects = await findProjectsWithTaskCount({
    take: +limit,
    skip: getSkip(limit, page),
    auth,
  });

  const pages = getPages(projects, limit);
  if (pages == 1 && projects.length === 1) {
    redirect(`${workspaceURI}/ticketing/projects/${projects[0].id}`);
  }
  if (!projects.length) {
    <h3>{await getTranslation('No projects found')}</h3>;
  }

  const imageURL = workspace.config.ticketHeroBgImage?.id
    ? `url(${getImageURL(workspace.config.ticketHeroBgImage.id, tenant)})`
    : IMAGE_URL;

  return (
    <>
      <HeroSearch
        title={
          workspace.config.ticketHeroTitle ||
          (await getTranslation('Ticketing'))
        }
        description={
          workspace.config.ticketHeroDescription ||
          (await getTranslation(
            'Mi eget leo viverra cras pharetra enim viverra. Ac at non pretium etiam viverra. Ac at non pretium etiam',
          ))
        }
        background={workspace.config.ticketHeroOverlayColorSelect || 'default'}
        blendMode={
          workspace.config.ticketHeroOverlayColorSelect ? 'overlay' : 'normal'
        }
        image={imageURL}
        tenantId={tenant}
      />
      <div className="container py-6 space-y-6">
        {projects.length === 0 ? (
          <h2 className="font-semibold text-xl text-center">
            {await getTranslation('No projects found')}
          </h2>
        ) : (
          <h2 className="font-semibold text-xl">
            {await getTranslation('Choose your project')}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(async project => (
            <Link
              key={project.id}
              href={`${workspaceURI}/ticketing/projects/${project.id}`}>
              <div className="bg-card p-6 rounded-lg">
                <p className="text-[1rem] font-semibold text-ellipsis whitespace-nowrap overflow-hidden">
                  {project.name}
                </p>
                <p className="text-[12px] font-medium mt-2">
                  {project.taskCount}{' '}
                  {project.taskCount === 1
                    ? await getTranslation('ticket')
                    : await getTranslation('tickets')}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {pages > 1 && (
          <Pagination className="!mb-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious asChild>
                  <Link
                    scroll={false}
                    className={cn({['invisible']: +page <= 1})}
                    replace
                    href={{
                      pathname: `${workspaceURI}/ticketing`,
                      query: {...searchParams, page: +page - 1},
                    }}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Link>
                </PaginationPrevious>
              </PaginationItem>
              {getPaginationButtons({
                currentPage: +page,
                totalPages: pages,
              }).map((value, i) => {
                if (typeof value == 'string') {
                  return (
                    <PaginationItem key={i}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={value}>
                    <PaginationLink isActive={+page === value} asChild>
                      <Link
                        scroll={false}
                        replace
                        href={{
                          pathname: `${workspaceURI}/ticketing`,
                          query: {...searchParams, page: value},
                        }}>
                        {value}
                      </Link>
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext asChild>
                  <Link
                    scroll={false}
                    replace
                    className={cn({['invisible']: +page >= pages})}
                    href={{
                      pathname: `${workspaceURI}/ticketing`,
                      query: {...searchParams, page: +page + 1},
                    }}>
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
