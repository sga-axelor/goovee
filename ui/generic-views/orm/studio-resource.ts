'use server';

import {headers} from 'next/headers';

import {TENANT_HEADER} from '@/middleware';
import {clone} from '@/utils';

import type {SchemaType, ViewSchema} from '../types';
import {findFieldsOfModel} from './meta-field';
import {FORM_VIEW, FORM_VIEW_2, GRID_VIEW, GRID_VIEW_2} from '../fake-data';

export async function findView({
  name,
  schemaType,
}: {
  name: string;
  schemaType: SchemaType;
}): Promise<{schema?: ViewSchema; metaFields?: any[]}> {
  const tenantId = headers().get(TENANT_HEADER);

  if (!tenantId) return {};

  // TODO: restore when studio available
  // const c = await manager.getClient(tenantId);

  // const schema: any = await c.aOSStudioResource
  //   .findOne({
  //     where: {
  //       name,
  //       type: 'VIEW',
  //       schemaType,
  //     },
  //     select: {
  //       name: true,
  //       content: true,
  //       schemaModel: true,
  //     },
  //   })
  //   .then(clone);

  let schema = null;
  if (name.includes('product')) {
    schema = {
      name,
      schemaModel: 'com.axelor.apps.base.db.Product',
      content: schemaType === 'form' ? FORM_VIEW : GRID_VIEW,
    };
  } else {
    schema = {
      name,
      schemaModel: 'com.axelor.apps.purchase.db.SupplierCatalog',
      content: schemaType === 'form' ? FORM_VIEW_2 : GRID_VIEW_2,
    };
  }

  if (schema == null) return {};

  const metaFields: any[] =
    (await findFieldsOfModel({
      tenantId,
      name: schema.schemaModel,
    }).then(clone)) ?? [];

  return {schema: schema.content.schema as any, metaFields};
}
