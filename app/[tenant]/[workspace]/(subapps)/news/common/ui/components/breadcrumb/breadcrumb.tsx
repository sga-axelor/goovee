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

// ---- LOCAL IMPORTS ---- //
import {NEWS} from '@/subapps/news/common/constants';
import {i18n} from '@/subapps/news/common/utils';

export const Breadcrumb = ({items, title}: {items: any; title: string}) => {
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
              href={`/news`}
              className="text-xs font-normal text-stone-400">
              {i18n.get(NEWS)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-black" />
          {items?.map((item: any, i: number) => {
            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={`/news/${generateRoute(i)}`}
                    className="text-xs font-normal text-stone-400">
                    {item.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-black" />
              </>
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
