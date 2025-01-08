import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {GenericForm} from './common/components';
import {FORM_VIEW} from './common/fake-data';
import {findFieldsOfModel} from './common/orm/meta-field';
import {workspacePathname} from '@/utils/workspace';
import {clone} from '@/utils';

export default async function Page({
  params,
}: {
  params: {tenant: string; workspace: string};
}) {
  const {tenant} = workspacePathname(params);

  const metaFields = await findFieldsOfModel({
    name: FORM_VIEW.schema.model,
    tenantId: tenant,
  }).then(clone);

  return (
    <GenericForm content={FORM_VIEW.schema} metaFields={metaFields as any[]} />
  );
}
