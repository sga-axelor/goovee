'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {NavbarCategoryMenu, Skeleton} from '@/ui/components';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import type {Category} from '@/subapps/news/common/types';
import {transformCategories} from '@/subapps/news/common/utils';

export const NavMenu = ({categories = []}: {categories: any[]}) => {
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
