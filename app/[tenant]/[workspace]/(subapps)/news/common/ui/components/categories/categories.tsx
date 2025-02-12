'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
// ---- CORE IMPORTS ---- //

import {NavbarCategoryMenu} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {Category} from '@/subapps/news/common/types';
import {transformCategories} from '@/subapps/news/common/utils';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export const Categories = ({categories}: {categories: any[]}) => {
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
