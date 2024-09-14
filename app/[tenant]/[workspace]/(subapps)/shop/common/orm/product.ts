'use server';

import axios from 'axios';

// ---- CORE IMPORTS ---- //
import {clone, scale} from '@/utils';
import {
  DEFAULT_CURRENCY_SCALE,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_TAX_VALUE,
  DEFAULT_UNIT_PRICE_SCALE,
} from '@/constants';
import type {
  Product,
  Currency,
  ComputedProduct,
  PortalWorkspace,
  User,
} from '@/types';
import {manager, type Tenant} from '@/tenant';

function getPageInfo({
  count = 0,
  limit,
  page,
}: {
  count?: number | string;
  limit?: number | string;
  page?: number | string;
}) {
  const pages = Math.ceil(Number(count) / Number(limit));

  return {
    count,
    limit,
    page,
    pages,
    hasNext: Number(page) !== Number(pages),
    hasPrev: Number(page) > 1,
  };
}

export async function findProducts({
  ids,
  search,
  sort,
  categoryids,
  page = 1,
  limit,
  workspace,
  user,
  tenantId,
}: {
  ids?: Product['id'][];
  search?: string;
  sort?: string;
  categoryids?: (string | number)[];
  page?: string | number;
  limit?: string | number;
  workspace?: PortalWorkspace;
  user?: User;
  tenantId: Tenant['id'];
}) {
  if (!(workspace && workspace.config && tenantId)) return [];

  const client = await manager.getClient(tenantId);

  let orderBy;

  switch (sort) {
    case 'byMostExpensive':
      orderBy = {salePrice: 'DESC'};
      break;
    case 'byLessExpensive':
      orderBy = {salePrice: 'ASC'};
      break;
    case 'byZToA':
      orderBy = {name: 'DESC'};
      break;
    case 'byFeature':
      orderBy = {featured: 'DESC'};
      break;
    case 'byNewest':
      orderBy = {createdOn: 'DESC'};
      break;
    case 'byAToZ':
    default:
      orderBy = {name: 'ASC'};
  }

  const skip = Number(limit) * Math.max(Number(page) - 1, 0);

  const fromWS = workspace?.config?.priceAfterLogin === 'fromWS';

  let $products = await client.aOSProduct
    .find({
      where: {
        ...(ids?.length
          ? {
              id: {
                in: ids,
              },
            }
          : {}),
        ...(search
          ? {
              name: {
                like: `%${search}%`,
              },
            }
          : {}),
        ...(categoryids?.length
          ? {
              portalCategorySet: {
                id: {
                  in: categoryids,
                },
              },
            }
          : {}),
        portalWorkspace: {
          id: workspace.id,
        },
      },
      orderBy: orderBy as any,
      take: limit as any,
      ...(skip ? {skip} : {}),
      select: {
        name: true,
        code: true,
        inAti: true,
        description: true,
        saleCurrency: {
          symbol: true,
        },
        salePrice: true,
        featured: true,
        createdOn: true,
        picture: {
          id: true,
        },
        allowCustomNote: true,
        portalImageList: {
          select: {
            picture: {
              id: true,
            },
          },
        },
        ...(fromWS
          ? {}
          : {
              productCompanyList: {
                select: {
                  salePrice: true,
                  company: {
                    id: true,
                    name: true,
                    currency: {
                      code: true,
                      numberOfDecimals: true,
                      symbol: true,
                    },
                  },
                },
              } as any,
              productFamily: {
                name: true,
                accountManagementList: {
                  where: {
                    company: {
                      id: workspace?.config?.company?.id,
                    },
                  },
                  select: {
                    name: true,
                    saleTaxSet: {
                      select: {
                        name: true,
                        activeTaxLine: {
                          name: true,
                          value: true,
                        },
                      },
                    },
                  },
                },
              } as any,
            }),
      },
    })
    .catch((err: any) => {
      console.log(err);
      return [];
    });

  const appbase = await client.aOSAppBase
    .findOne({
      select: {
        nbDecimalDigitForUnitPrice: true,
      },
    })
    .then(clone);

  const compute = (product: any, ws?: boolean, wsProduct?: any) => {
    const productcompany =
      workspace?.config?.company?.id &&
      product?.productCompanyList?.find(
        (c: any) =>
          c.company &&
          Number(c.company.id) === Number(workspace?.config?.company?.id),
      );

    const account = product?.productFamily?.accountManagementList?.[0];

    const getTax = (): ComputedProduct['tax'] => {
      if (ws) {
        return {
          value: Number(wsProduct?.tax?.value || DEFAULT_TAX_VALUE),
        };
      }

      const activeTax = account?.saleTaxSet?.find((t: any) => t.activeTaxLine);

      const activeTaxLineValue =
        activeTax?.activeTaxLine?.value || DEFAULT_TAX_VALUE;

      return {
        value: productcompany?.company ? activeTaxLineValue : DEFAULT_TAX_VALUE,
      };
    };

    const getScale = (): ComputedProduct['scale'] => {
      if (ws) {
        return (
          wsProduct?.scale || {
            unit: DEFAULT_UNIT_PRICE_SCALE,
            currency: DEFAULT_CURRENCY_SCALE,
          }
        );
      }

      return {
        unit: appbase?.nbDecimalDigitForUnitPrice || DEFAULT_UNIT_PRICE_SCALE,
        currency:
          productcompany?.company?.currency?.numberOfDecimals ||
          DEFAULT_CURRENCY_SCALE,
      };
    };

    const getCurrency = (): Currency => {
      if (ws) {
        return (
          wsProduct?.currency || {
            symbol: DEFAULT_CURRENCY_SYMBOL,
          }
        );
      }

      return (
        product?.saleCurrency ||
        productcompany?.company?.currency || {
          symbol: DEFAULT_CURRENCY_SYMBOL,
        }
      );
    };

    const getPrice = (): ComputedProduct['price'] => {
      const value = productcompany?.salePrice || product.salePrice || 0;

      const taxrate = getTax()?.value || 0;

      let ati, wt, displayAti, displayWt;

      const {config = {}}: any = workspace;
      const {mainPrice, displayTwoPrices} = config;

      const currencySymbol = getCurrency().symbol;
      const unitScale = getScale().unit;

      if (ws) {
        const $wt = wsProduct?.price?.discountedWT;
        const $ati = wsProduct?.price?.discountedATI;
        ati = Number($ati || 0);
        wt = Number($wt || 0);
      } else {
        const inati = product.inAti;

        if (inati) {
          ati = Number(value);
          wt = ati - (ati * taxrate) / 100;
        } else {
          wt = Number(value);
          ati = wt + (wt * taxrate) / 100;
        }

        ati = scale(ati, unitScale);
        wt = scale(wt, unitScale);
      }

      displayAti = `${ati} ${currencySymbol}`;
      displayWt = `${wt} ${currencySymbol}`;

      let primary, secondary, displayPrimary, displaySecondary;

      if (mainPrice === 'at') {
        primary = ati;
        secondary = wt;
        displayPrimary = `${ati} ${getCurrency().symbol} ATI`;
        displaySecondary = `${wt} ${getCurrency().symbol} WT`;
      } else {
        primary = wt;
        secondary = ati;
        displayPrimary = `${wt} ${getCurrency().symbol} WT`;
        displaySecondary = `${ati} ${getCurrency().symbol} ATI`;
      }

      return {
        ati,
        wt,
        primary,
        secondary,
        displayAti,
        displayWt,
        displayPrimary,
        displaySecondary,
        mainPrice,
        displayTwoPrices: displayTwoPrices === 'yes',
      };
    };

    return {
      product,
      price: getPrice(),
      tax: getTax(),
      scale: getScale(),
      currency: getCurrency(),
    };
  };

  $products = ($products || []).map((p: any) => ({
    ...p,
    images: [
      p?.picture?.id,
      ...(p?.portalImageList || [])?.map((i: any) => i?.picture?.id),
    ].filter(Boolean),
  }));

  const pageInfo = getPageInfo({
    count: $products?.[0]?._count,
    page,
    limit,
  });

  if (fromWS) {
    const productsFromWS = await findProductsFromWS({
      productIds: $products.map(p => p.id),
      workspace,
      user,
      tenantId,
    });

    const originalProduct = (id: any) =>
      $products.find(p => Number(p.id) === Number(id));

    return {
      products: productsFromWS
        .map((wsProduct: any) => {
          const product = originalProduct(wsProduct?.product?.id);
          if (!product) return null;
          return compute(product, true, wsProduct);
        })
        .filter(Boolean),
      pageInfo,
    };
  } else {
    return {
      products: $products.map((product: any) => compute(product)),
      pageInfo,
    };
  }
}

export async function findProduct({
  id,
  workspace,
  user,
  tenantId,
}: {
  id: Product['id'];
  workspace?: PortalWorkspace;
  user?: User;
  tenantId: Tenant['id'];
}) {
  return (
    id &&
    findProducts({ids: [id], workspace, user, tenantId}).then(
      ({products}: any = {}) => products && products[0],
    )
  );
}

export async function findProductsFromWS({
  workspace,
  user,
  productIds,
  tenantId,
}: {
  workspace: PortalWorkspace;
  user?: User;
  productIds: Array<Product['id']>;
  tenantId: Tenant['id'];
}) {
  if (!workspace?.config?.company?.id && user && productIds && tenantId) {
    return [];
  }

  const tenant = await manager.getTenant(tenantId);

  if (!tenant?.config?.aos?.url) {
    return [];
  }

  const {aos} = tenant.config;

  const ws = `${aos.url}/ws/portal/products/productPrices`;

  try {
    const res = await axios
      .post(
        ws,
        {
          partnerId: user?.id,
          companyId: workspace?.config?.company?.id,
          productIds,
          taxSelect: 'both',
        },
        {
          auth: {
            username: aos.auth.username,
            password: aos.auth.password,
          },
        },
      )
      .then(({data}) => data);

    if (res?.data?.status === -1) {
      return [];
    }

    return res?.data || [];
  } catch (err) {
    return [];
  }
}
