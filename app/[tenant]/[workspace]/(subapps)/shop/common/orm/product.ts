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
} from '@/types';
import {getClient} from '@/goovee';

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
}: {
  ids?: Product['id'][];
  search?: string;
  sort?: string;
  categoryids?: (string | number)[];
  page?: string | number;
  limit?: string | number;
  workspace?: PortalWorkspace;
}) {
  if (!(workspace && workspace.config)) return [];

  const client = await getClient();

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

  const $products = await client.aOSProduct
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
      orderBy,
      take: limit,
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
        productCompanyList: {
          select: {
            salePrice: true,
            company: {
              id: true,
              name: true,
              currency: {
                code: true,
                numberOfDecimals: true,
              },
            },
          },
        },
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
                activeTaxLine: {
                  name: true,
                  value: true,
                },
              },
            },
          },
        },
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

  const compute = (product: any) => {
    const productcompany =
      workspace?.config?.company?.id &&
      product?.productCompanyList?.find(
        (c: any) =>
          c.company &&
          Number(c.company.id) === Number(workspace?.config?.company?.id),
      );

    const account = product?.productFamily?.accountManagementList?.[0];

    const getTax = (): ComputedProduct['tax'] => {
      const activeTaxLine =
        account?.saleTaxSet?.find((t: any) => t.activeTaxLine)?.value ||
        DEFAULT_TAX_VALUE;

      return {
        value: productcompany?.company ? activeTaxLine : DEFAULT_TAX_VALUE,
      };
    };

    const getScale = (): ComputedProduct['scale'] => {
      return {
        unit: appbase?.nbDecimalDigitForUnitPrice || DEFAULT_UNIT_PRICE_SCALE,
        currency:
          productcompany?.company?.currency?.numberOfDecimals ||
          DEFAULT_CURRENCY_SCALE,
      };
    };

    const getCurrency = (): Currency => {
      return (
        product?.saleCurrency ||
        productcompany?.company?.currency || {
          symbol: DEFAULT_CURRENCY_SYMBOL,
        }
      );
    };

    const getPrice = (): ComputedProduct['price'] => {
      const value = productcompany?.salePrice || product.salePrice;

      const inati = product.inAti;

      const taxrate = getTax()?.value || 0;

      let ati, wt, displayAti, displayWt;

      const {config = {}}: any = workspace;
      const {mainPrice, displayTwoPrices} = config;

      const currencySymbol = getCurrency().symbol;
      const unitScale = getScale().unit;

      if (inati) {
        ati = Number(value);
        wt = ati - (ati * taxrate) / 100;
      } else {
        wt = Number(value);
        ati = wt + (wt * taxrate) / 100;
      }

      ati = scale(ati, unitScale);
      wt = scale(wt, unitScale);

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

  return {
    products: ($products || [])
      .map((p: any) => ({
        ...p,
        images: [
          p?.picture?.id,
          ...(p?.portalImageList || [])?.map((i: any) => i?.picture?.id),
        ].filter(Boolean),
      }))
      .map(compute),
    pageInfo: getPageInfo({
      count: $products?.[0]?._count,
      page,
      limit,
    }),
  };
}

export async function findProduct({
  id,
  workspace,
}: {
  id: Product['id'];
  workspace?: PortalWorkspace;
}) {
  return (
    id &&
    findProducts({ids: [id], workspace}).then(
      ({products}: any = {}) => products && products[0],
    )
  );
}
