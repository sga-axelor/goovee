'use client';
import React from 'react';
import { Label } from '@ui/components/label';
import { Checkbox } from '@ui/components/checkbox';
// ---- CORE IMPORTS ---- //
export function ProductListBrandFilter() {
  return (
    <div className="flex flex-col gap-2">
      <h6 className='text-base font-semibold'>Brand</h6>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">
          Brand 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">
          Brand 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">
          Brand 3
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">
          Brand 4
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">
          Brand 5
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox />
        <Label className="ml-4 text-xs">
          All
        </Label>
      </div>
    </div>
  );
}
export default ProductListBrandFilter;