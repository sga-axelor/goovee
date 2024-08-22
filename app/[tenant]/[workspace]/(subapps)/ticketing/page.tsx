// ---- CORE IMPORTS ---- //
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
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
import {clone} from '@/utils';
import {cn} from '@/utils/css';
import {workspacePathname} from '@/utils/workspace';
import {ChevronLeft} from 'lucide-react';
import Link from 'next/link';
import {redirect} from 'next/navigation';

// ---- LOCAL IMPORTS ---- //
import {findProjectsWithTaskCount} from './common/orm/projects';
import {getPages, getPaginationButtons, getSkip} from './common/utils';

export default async function Page({
  params,
  searchParams,
}: {
  params: {tenant: string; workspace: string};
  searchParams: {[key: string]: string | undefined};
}) {
  const session = await getSession();
  const {workspaceURL, workspaceURI} = workspacePathname(params);

  const {limit = 8, page = 1} = searchParams;

  const workspace = await findWorkspace({
    user: session?.user,
    url: workspaceURL,
  }).then(clone);

  const projects = await findProjectsWithTaskCount({
    take: +limit,
    skip: getSkip(limit, page),
  });

  const pages = getPages(projects, limit);
  if (pages == 1 && projects.length === 1) {
    redirect(`${workspaceURI}/ticketing/projects/${projects[0].id}`);
  }

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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`${workspaceURI}/ticketing/projects/${project.id}`}>
              <div className="bg-card p-6">
                <p className="text-[1rem] font-semibold">{project.name}</p>
                <p className="text-[12px] font-semibold">
                  {project.taskCount} tickets
                </p>
              </div>
            </Link>
          ))}
        </div>
        {pages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious asChild>
                  <Link
                    className={cn({
                      ['invisible']: +page <= 1,
                    })}
                    href={{
                      pathname: `${workspaceURI}/ticketing`,
                      query: {
                        ...searchParams,
                        page: +page - 1,
                      },
                    }}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous</span>
                  </Link>
                </PaginationPrevious>
              </PaginationItem>
              {getPaginationButtons(+page, pages).map((value, i) => {
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
                        href={{
                          pathname: `${workspaceURI}/ticketing`,
                          query: {
                            ...searchParams,
                            page: value,
                          },
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
                    className={cn({
                      ['invisible']: +page >= pages,
                    })}
                    href={{
                      pathname: `${workspaceURI}/ticketing`,
                      query: {
                        ...searchParams,
                        page: +page + 1,
                      },
                    }}></Link>
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
