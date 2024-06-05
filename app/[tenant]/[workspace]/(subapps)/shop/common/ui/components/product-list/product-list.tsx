'use client';

import React, {Fragment} from 'react';
import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import {Box, Input, useClassNames, clsx} from '@axelor/ui';
import {MaterialIcon} from '@axelor/ui/icons/material-icon';
import {Button} from '@/components/ui/button';
// ---- CORE IMPORTS ---- //
import {Pagination} from '@/ui/components';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {i18n} from '@/lib/i18n';
import type {ComputedProduct, Product, PortalWorkspace} from '@/types';

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
    <Box color="secondary" d="flex" alignItems="center" gap="0.5rem">
      <Box d="flex">
        <MaterialIcon icon="filter_alt" />
      </Box>
      <Box as="p" mb={0} fontWeight="bold">
        {i18n.get('Filters')}
      </Box>
    </Box>
  );
}

export function ProductList({
  products = [],
  categories,
  category,
  pageInfo = {page: 1, pages: 1},
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
  const {cart, addItem} = useCart();
  const {workspaceURI} = useWorkspace();

  const {page, pages} = pageInfo;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cs = useClassNames();

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
    values.forEach(({key, value = ''}: any) => {
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
    const {product} = computedProduct;
    await addItem({productId: product?.id, quantity: 1});
    router.refresh();
  };

  const handleChangeSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    updateSearchParams([
      {key: 'page'},
      {key: 'search', value: formData.get('search') as string},
    ]);
  };

  const handleChangeSortBy = ({value}: any) => {
    updateSearchParams([{key: 'sort', value}]);
  };

  const handleChangeView = (type: string) => {
    updateSearchParams([{key: 'view', value: type}]);
  };

  const handlePreviousPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {page, hasPrev} = pageInfo;
    if (!hasPrev) return;
    updateSearchParams([{key: 'page', value: Math.max(Number(page) - 1, 1)}]);
  };

  const handleNextPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {page, hasNext} = pageInfo;
    if (!hasNext) return;
    updateSearchParams([{key: 'page', value: Number(page) + 1}]);
  };

  const handlePage = (page: string | number) => {
    updateSearchParams([{key: 'page', value: page}]);
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
    <Box>
      <Categories items={categories} onClick={handleCategoryClick} />
      {showSummary && (
        <Box className="flex items-center justify-center relative bg-[url('/images/bg.jpeg')] bg-center h-[650px]">
          <Box className="absolute top-0 left-0 w-full h-full bg-foreground/[.65]" />
          <Box as="h1" className="font-bold m-0 z-[1] text-primary-foreground">
            {i18n.get('Shop summary')}
          </Box>
        </Box>
      )}
      <Box className={clsx(cs('container'), 'portal-container')} py={3}>
        <Box mb={4}>
          {breadcrumbs?.length > 1 ? (
            <Box d="flex" gap="1rem" alignItems="center">
              {breadcrumbs.map((crumb: any, i: number) => {
                const islast = breadcrumbs.length - 1 === i;

                return (
                  <Fragment key={i}>
                    <Box d="flex" alignItems="center" className="pointer">
                      <Box
                        {...(islast
                          ? {
                              color: 'primary',
                              fontWeight: 'bold',
                            }
                          : {color: 'secondary'})}
                        onClick={() => handleCategoryClick(crumb)}>
                        {i18n.get(crumb.name)}
                      </Box>
                      {!islast && (
                        <Box d="flex">
                          <MaterialIcon icon="chevron_right" />
                        </Box>
                      )}
                    </Box>
                  </Fragment>
                );
              })}
            </Box>
          ) : null}
        </Box>
        <Box className="flex items-center justify-between">
          <Box as="h4" className="text-xl font-medium text-primary">
            {category && category?.name}
          </Box>
          <Box
            as="h4"
            className="text-sm font-medium text-primary flex items-center">
            See all
            <MaterialIcon
              className="cursor-pointer ml-2"
              icon="arrow_forward"
            />
          </Box>
        </Box>
        <Box d="flex" justifyContent="end" alignItems="center" mb={2}>
          <Box d="flex" alignItems="center" gap="1rem">
            <MaterialIcon
              color={isGridView ? 'primary' : 'secondary'}
              className="pointer"
              icon="grid_view"
              onClick={() => handleChangeView(VIEW.GRID)}
            />
            <MaterialIcon
              color={isListView ? 'primary' : 'secondary'}
              className="pointer"
              icon="list"
              onClick={() => handleChangeView(VIEW.LIST)}
            />
          </Box>
        </Box>
        {/* <Box d="flex" alignItems="center" mb={3} gap="1rem">
          <Box
            as="form"
            onSubmit={handleChangeSearch}
            flexBasis={{ base: "100%", md: "70%" }}
            className={styles.wrapper}
          >
            <Input
              name="search"
              placeholder="Search"
              rounded="pill"
              ps={5}
              defaultValue={search}
            />
            <Box className={styles.icons}>
              <MaterialIcon icon="search" />
            </Box>
          </Box>
          <SortBy
            workspace={workspace}
            onChange={handleChangeSortBy}
            value={sort}
          />
        </Box> */}
        <Box
          bg="white"
          shadow
          mb={3}
          d={{base: 'grid', md: 'none'}}
          gridTemplateColumns="1fr 1fr"
          gap="0.5rem"
          py={2}
          px={2}>
          <MobileSortBy
            active={sort}
            workspace={workspace}
            onChange={handleChangeSortBy}
          />
          <MobileFilters />
        </Box>
        <Box
          d="grid"
          gridTemplateColumns={
            isListView
              ? {base: '1fr', sm: '1fr', md: '1fr'}
              : {
                  base: '1fr',
                  sm: '1fr',
                  md: '1fr 1fr',
                  lg: '1fr 1fr 1fr',
                  xl: '1fr 1fr 1fr 1fr',
                }
          }
          gridGap="1.25rem">
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
            <Box>{i18n.get('No product available.')}</Box>
          )}
        </Box>
        <Box mt={4} mb={3} d="flex" alignItems="center" justifyContent="center">
          <Pagination
            page={page}
            pages={pages}
            disablePrev={!pageInfo?.hasPrev}
            disableNext={!pageInfo?.hasNext}
            onPrev={handlePreviousPage}
            onNext={handleNextPage}
            onPage={handlePage}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ProductList;
