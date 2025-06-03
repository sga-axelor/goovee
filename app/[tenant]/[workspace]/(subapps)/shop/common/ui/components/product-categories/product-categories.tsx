'use client';

import {useRouter} from 'next/navigation';

import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import type {Category} from '@/types';

import {NavbarCategoryMenu} from '@/ui/components/navbar-category-menu';

export function ProductCategories({categories}: any) {
  const {workspaceURI} = useWorkspace();
  const router = useRouter();

  const handleCategoryClick = ({category}: {category: Category}) => {
    router.push(`${workspaceURI}/shop/category/${category.slug}`);
  };

  return (
    <NavbarCategoryMenu categories={categories} onClick={handleCategoryClick} />
  );
}

export default ProductCategories;
