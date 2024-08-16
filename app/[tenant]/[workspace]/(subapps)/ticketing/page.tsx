import {MdAdd} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {clone} from '@/utils';
import {IMAGE_URL} from '@/constants';
import {i18n} from '@/lib/i18n';
import {getSession} from '@/orm/auth';
import {findWorkspace} from '@/orm/workspace';
import {workspacePathname} from '@/utils/workspace';

import {Button, HeroSearch} from '@/ui/components';

import Link from 'next/link';
import {findProjectsWithTaskCount} from './common/orm/projects';
import {redirect} from 'next/navigation';
import {getPaginationButtons, getPages, getSkip} from './common/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './common/ui/components/pagination';
import {cn} from '@/utils/css';

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
    redirect(`/${workspaceURI}/ticketing/projects/${projects[0].id}`);
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
          <Button variant="success" className="flex items-center">
            <MdAdd className="size-6" />
            <span>{i18n.get('Create a new project')}</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <Link
              key={project.id}
              href={`/${workspaceURI}/ticketing/projects/${project.id}`}>
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
                <PaginationPrevious
                  className={cn({
                    ['invisible']: +page <= 1,
                  })}
                  href={`${workspaceURI}/ticketing?page=${+page - 1}`}
                />
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
                    <PaginationLink
                      isActive={+page === value}
                      href={`${workspaceURI}/ticketing?page=${value}`}>
                      {value}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  className={cn({
                    ['invisible']: +page >= pages,
                  })}
                  href={`${workspaceURI}/ticketing?page=${+page + 1}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
