import React from 'react';

// ---- LOCAL IMPORTS ---- //
import {getGenericFormContent, getGenericGridContent} from '@/ui/generic-views';
import {GenericForm, GenericGrid} from './common/components';
import {FORM_DATA, GRID_DATA} from './fake-data';

export default async function Page({}) {
  const formContent = await getGenericFormContent('product-form');
  const gridContent = await getGenericGridContent('product-grid');

  return (
    <div>
      <GenericForm {...formContent} data={FORM_DATA} />
      <GenericGrid
        {...gridContent}
        data={GRID_DATA}
        creationContent={formContent}
      />
    </div>
  );
}
