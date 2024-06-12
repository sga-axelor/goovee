'use client';

import React, { Fragment } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { BiSearch } from 'react-icons/bi';
import { MdOutlineFilterAlt } from 'react-icons/md';
import { LuChevronRight } from 'react-icons/lu';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { MdGridView } from 'react-icons/md';
import { MdOutlineList } from 'react-icons/md';
import { TextField } from '@/components/ui/TextField';
// ---- CORE IMPORTS ---- //
import { Pagination } from '@/ui/components';
import { useCart } from '@/app/[tenant]/[workspace]/cart-context';
import { useWorkspace } from '@/app/[tenant]/[workspace]/workspace-context';
import { i18n } from '@/lib/i18n';
import type { ComputedProduct, Product, PortalWorkspace } from '@/types';
// ---- LOCAL IMPORTS ---- //
import {
  MobileSortBy,
  SortBy,
  ProductCard,
  ProductListItem,
  Categories,
} from '..';
import styles from './product-list.module.scss';

const VIEW = {
  GRID: 'grid',
  LIST: 'list',
};
function MobileFilters() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <MdOutlineFilterAlt className="text-xl" />
      <p className="mb-0 font-bold">{i18n.get('Filters')}</p>
    </div>
  );
}
export function ProductList({
  products = [],
  categories,
  category,
  pageInfo = { page: 1, pages: 1 },
  workspace,
  breadcrumbs,
  showSummary,
  productPath,
}: {
  breadcrumbs?: any;
  products: ComputedProduct[];
  categories?: any;
  category?: any;
  pageInfo?: any;
  workspace?: PortalWorkspace;
  showSummary?: boolean;
  productPath?: string;
}) {
  const { cart, addItem } = useCart();
  const { workspaceURI } = useWorkspace();
  const { page, pages } = pageInfo;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort');
  const view = searchParams.get('view') || VIEW.GRID;
  const updateSearchParams = (
    values: Array<{
      key: string;
      value?: string | number;
    }>,
  ) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    values.forEach(({ key, value = '' }: any) => {
      value = value && String(value)?.trim();
      if (!value) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${pathname}${query}`);
  };
  const handleAdd = async (computedProduct: ComputedProduct) => {
    const { product } = computedProduct;

    await addItem({ productId: product?.id, quantity: 1, images: product?.images, computedProduct: computedProduct });
    router.refresh();
  };
  const handleChangeSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    updateSearchParams([
      { key: 'page' },
      { key: 'search', value: formData.get('search') as string },
    ]);
  };
  const handleChangeSortBy = ({ value }: any) => {
    updateSearchParams([{ key: 'sort', value }]);
  };
  const handleChangeView = (type: string) => {
    updateSearchParams([{ key: 'view', value: type }]);
  };
  const handlePreviousPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { page, hasPrev } = pageInfo;
    if (!hasPrev) return;
    updateSearchParams([{ key: 'page', value: Math.max(Number(page) - 1, 1) }]);
  };
  const handleNextPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { page, hasNext } = pageInfo;
    if (!hasNext) return;
    updateSearchParams([{ key: 'page', value: Number(page) + 1 }]);
  };
  const handlePage = (page: string | number) => {
    updateSearchParams([{ key: 'page', value: page }]);
  };
  const handleCategoryClick = (category: any) => {
    router.push(
      `${workspaceURI}/shop/category/${category.name}-${category.id}`,
    );
  };
  const handleProductClick = (product: Product) => {
    router.push(
      `${productPath}/${encodeURIComponent(product.name)}-${product.id}`,
    );
  };
  const isGridView = view === VIEW.GRID;
  const isListView = view === VIEW.LIST;

  return (
    <div>
      <Categories items={categories} onClick={handleCategoryClick} />
      {showSummary && (
        <div className="flex items-center justify-center relative bg-[url('/images/bg.jpeg')] bg-center h-[650px]">
          <div className="absolute top-0 left-0 w-full h-full bg-foreground/[.65]" />
          <h1 className="font-bold text-4xl m-0 z-[1] text-primary-foreground">
            {i18n.get('Shop summary')}
          </h1>
        </div>
      )}


      <div className={'container portal-container'}>
        <div className="mb-6">
          {breadcrumbs?.length > 1 ? (
            <div className="flex items-center gap-4">
              {breadcrumbs.map((crumb: any, i: number) => {
                const islast = breadcrumbs.length - 1 === i;

                return (
                  <Fragment key={i}>
                    <div className="flex items-center cursor-pointer">
                      <div
                        {...(islast
                          ? {
                            color: 'primary',
                            fontWeight: 'bold',
                          }
                          : { color: 'secondary' })}
                        onClick={() => handleCategoryClick(crumb)}>
                        {i18n.get(crumb.name)}
                      </div>
                      {!islast && (
                        <div className="flex">
                          <LuChevronRight className="text-xl" />
                        </div>
                      )}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-medium text-primary">
            {category && category?.name}
          </h4>
          <p className="text-sm font-medium text-primary flex items-center mb-0">
            See all
            <IoIosArrowRoundForward className="cursor-pointer text-xl ml-2" />
          </p>
        </div>
        <div className="flex items-center justify-end mb-2">
          <div className="flex items-center gap-4">
            <MdGridView
              color={isGridView ? 'primary' : 'secondary'}
              className="cursor-pointer text-2xl"
              onClick={() => handleChangeView(VIEW.GRID)}
            />
            <MdOutlineList
              color={isListView ? 'primary' : 'secondary'}
              className="cursor-pointer text-2xl"
              onClick={() => handleChangeView(VIEW.LIST)}
            />
          </div>
        </div>
        <div className="flex items-start gap-4 mb-4">
          <form
            onSubmit={handleChangeSearch}
            className={`${styles.wrapper} basis-full md:basis-[70%]`}>
            <TextField
              name="search"
              placeholder="Search"
              defaultValue={search}
              className="pl-12 rounded-full"
            />
            <div className={`${styles.icons} top-[10px] !pt-0`}>
              <BiSearch className="text-2xl" />
            </div>
          </form>
          <SortBy
            workspace={workspace}
            onChange={handleChangeSortBy}
            value={sort}
          />
        </div>
        <div className="bg-white shadow mb-4 grid md:hidden grid-cols-2 gap-2 p-2">
          <MobileSortBy
            active={sort}
            workspace={workspace}
            onChange={handleChangeSortBy}
          />
          <MobileFilters />
        </div>
        <div
          className={`${isListView ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} grid gap-5 `}>
          {products?.length ? (
            products.map(computedProduct => {
              const quantity = cart?.items?.find(
                (i: any) =>
                  Number(i.product) === Number(computedProduct?.product.id),
              )?.quantity;
              const Component = isListView ? ProductListItem : ProductCard;

              return (
                <Component
                  key={computedProduct?.product.id}
                  product={computedProduct}
                  quantity={quantity}
                  onAdd={handleAdd}
                  displayPrices={workspace?.config?.displayPrices}
                  onClick={handleProductClick}
                />
              );
            })
          ) : (
            <div>{i18n.get('No product available.')}</div>
          )}
        </div>
        <div className="mt-6 mb-4 flex items-center justify-center">
          <Pagination
            page={page}
            pages={pages}
            disablePrev={!pageInfo?.hasPrev}
            disableNext={!pageInfo?.hasNext}
            onPrev={handlePreviousPage}
            onNext={handleNextPage}
            onPage={handlePage}
          />
        </div>
      </div>
    </div>
  );
}
export default ProductList;
