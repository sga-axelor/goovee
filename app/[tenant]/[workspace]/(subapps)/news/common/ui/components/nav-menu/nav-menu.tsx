'use client';

import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {NavbarCategoryMenu, Skeleton} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import type {Category, RawNewsCategory} from '@/subapps/news/common/types';
import {transformCategories} from '@/subapps/news/common/utils';

export const NavMenu = ({categories = []}: {categories: RawNewsCategory[]}) => {
  const $categories = transformCategories(categories);
  const router = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleCategoriesClick = ({
    category,
    url,
  }: {
    category: Category;
    url: string;
  }) => {
    router.push(`${workspaceURI}/news/${url}`);
  };

  return (
    <NavbarCategoryMenu
      categories={$categories}
      onClick={handleCategoriesClick}
      slugKey={'slug'}
    />
  );
};

export function NavMenuSkeleton() {
  return (
    <div className="bg-white flex gap-4 h-14 items-center">
      <Skeleton className="h-10 w-28 rounded" />
      {/* Divider */}
      <Skeleton className="w-px h-8" />
      <Skeleton className="h-10 w-28 rounded" />
      {/* Divider */}
      <Skeleton className="w-px h-8" />
      <Skeleton className="h-10 w-28 rounded" />
    </div>
  );
}
