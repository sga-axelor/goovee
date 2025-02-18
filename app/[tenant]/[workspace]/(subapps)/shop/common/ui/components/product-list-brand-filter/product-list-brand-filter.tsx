'use client';
import React from 'react';

// ---- CORE IMPORTS ---- //
import {Label, Checkbox} from '@/ui/components';
import {i18n} from '@/locale';

export function ProductListBrandFilter() {
  return (
    <div className="flex flex-col gap-2">
      <h6 className="font-semibold">{i18n.t('Brand')}</h6>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">{i18n.t('Brand 1')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">{i18n.t('Brand 2')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">{i18n.t('Brand 3')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">{i18n.t('Brand 4')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">{i18n.t('Brand 5')}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">{i18n.t('All')}</Label>
      </div>
    </div>
  );
}
export default ProductListBrandFilter;
