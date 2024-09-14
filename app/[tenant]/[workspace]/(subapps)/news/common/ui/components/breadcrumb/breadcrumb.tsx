import React from 'react';

// ---- CORE IMPORTS ---- //
import {
  Breadcrumb as ShadCnBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/ui/components/breadcrumb';
import {i18n} from '@/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {NEWS} from '@/subapps/news/common/constants';

export const Breadcrumb = ({items, title}: {items: any; title: string}) => {
  const {workspaceURI} = useWorkspace();

  const generateRoute = (index: number) => {
    return items
      .map((item: any) => item.slug)
      .slice(0, index + 1)
      .join('/');
  };

  return (
    <>
      <ShadCnBreadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`${workspaceURI}/news`}
              className="text-xs font-normal text-stone-400">
              {i18n.get(NEWS)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-black" />
          {items?.map((item: any, i: number) => {
            return (
              <React.Fragment key={item.id}>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`${workspaceURI}/news/${generateRoute(i)}`}
                    className="text-xs font-normal text-stone-400">
                    {item.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-black" />
              </React.Fragment>
            );
          })}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-xs font-normal text-black">
              {title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </ShadCnBreadcrumb>
    </>
  );
};

export default Breadcrumb;
