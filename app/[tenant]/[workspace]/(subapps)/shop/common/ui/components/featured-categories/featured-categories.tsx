'use client';

import {Fragment} from 'react';
import {MdEast} from 'react-icons/md';
import {useRouter} from 'next/navigation';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Pagination} from 'swiper/modules';

// ---- CORE IMPORTS ---- //
import {Button, NavbarCategoryMenu} from '@/ui/components';
import {getImageURL} from '@/utils/files';
import {i18n} from '@/locale';
import {useCart} from '@/app/[tenant]/[workspace]/cart-context';
import {useToast} from '@/ui/hooks';
import type {
  Category,
  ComputedProduct,
  ID,
  PortalWorkspace,
  Product,
} from '@/types';

// ---- LOCAL IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {ProductCard} from '@/subapps/shop/common/ui/components/product-card';

export function FeaturedCategories({
  categories,
  featuredCategories,
  workspace,
}: {
  categories?: any;
  featuredCategories: Array<Category & {products: ComputedProduct[]}>;
  workspace: PortalWorkspace;
}) {
  const router = useRouter();

  const {workspaceURI, tenant} = useWorkspace();
  const {cart, addItem} = useCart();
  const {toast} = useToast();

  const handleAddProduct = async (computedProduct: ComputedProduct) => {
    const {product} = computedProduct;

    await addItem({
      productId: product?.id,
      quantity: 1,
      images: product?.images,
      computedProduct: computedProduct,
    });

    toast({
      title: i18n.t('Added to cart'),
    });
  };

  const handleProductClick = (category: Category) => (product: Product) => {
    router.push(
      `${workspaceURI}/shop/category/${encodeURIComponent(category.name)}-${category.id}/product/${encodeURIComponent(product.name)}-${product.id}`,
    );
  };

  const handleCategoryClick = ({category}: {category: Category}) => {
    router.push(
      `${workspaceURI}/shop/category/${encodeURIComponent(category.name)}-${category.id}`,
    );
  };

  const carouselList = workspace?.config?.carouselList;

  return (
    <div>
      <div className="relative">
        <NavbarCategoryMenu
          categories={categories}
          onClick={handleCategoryClick}
        />
      </div>
      {carouselList?.length ? (
        <Swiper
          modules={[Pagination]}
          pagination={{
            type: 'bullets',
            clickable: true,
            bulletActiveClass: '[&>div]:bg-black',
            horizontalClass: '!bottom-[4.375rem]',
            renderBullet: (index, className) =>
              `<div class="${className} h-3 w-3 rounded-full bg-transparent border border-black inline-flex items-center justify-center">
              <div class="h-2 w-2 rounded-full"></div>
            </div>`,
          }}>
          {carouselList.map((item, i) => {
            return (
              <SwiperSlide key={i} className="max-w-full">
                <div
                  className="flex items-center relative bg-center bg-no-repeat bg-cover h-[750px] p-4 md:p-20"
                  style={{
                    backgroundImage: `url("${getImageURL(item?.image?.id as ID, tenant)}")`,
                  }}>
                  <div className="absolute top-0 left-0 w-full h-full bg-black/[.15]" />
                  <div className="space-y-10 md:w-1/2 z-20">
                    <h2 className="font-medium text-4xl">{item.title}</h2>
                    <p className="text-xl">{item.subTitle}</p>
                    <Button className="relative z-10" asChild>
                      <a
                        href={item.href || '#'}
                        target="_blank"
                        rel="noopener noreferrer">
                        {i18n.t(item?.buttonLabel || 'Shop products')}
                      </a>
                    </Button>
                  </div>
                  <div className="absolute left-0 top-0 right-0 bottom-0 z-10 bg-[linear-gradient(90deg,_#FFF_14.57%,_rgba(255,255,255,0.00)_98.91%)]"></div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : null}
      <div className="container flex flex-col gap-6 mx-auto px-2 mb-4">
        {featuredCategories.map(category =>
          category?.products?.length ? (
            <Fragment key={category.id}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl leading-7 font-medium">
                  {category.name}
                </h3>
                <div
                  className="flex gap-2 px-3 py-4 cursor-pointer"
                  onClick={() => handleCategoryClick({category})}>
                  <span className="leading-6 text-sm">{i18n.t('See All')}</span>
                  <MdEast className="w-6 h-6" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {category.products.map((computedProduct: ComputedProduct) => {
                  const quantity = cart?.items?.find(
                    (i: any) =>
                      Number(i.product) === Number(computedProduct?.product.id),
                  )?.quantity;

                  return (
                    <ProductCard
                      key={computedProduct.product.id}
                      product={computedProduct}
                      quantity={quantity}
                      onAdd={handleAddProduct}
                      displayPrices={workspace?.config?.displayPrices}
                      onClick={handleProductClick(category)}
                    />
                  );
                })}
              </div>
            </Fragment>
          ) : null,
        )}
      </div>
    </div>
  );
}
