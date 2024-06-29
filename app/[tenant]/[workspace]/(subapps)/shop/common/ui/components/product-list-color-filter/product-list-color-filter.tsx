'use client';

import {cn} from '@/lib/utils';
import React, {useState} from 'react';

const filters = [
  {code: 'black', label: 'Black', bg: 'bg-black'},
  {code: 'purple', label: 'Purple', bg: 'bg-palette-purple-dark'},
  {code: 'yellow', label: 'Yellow', bg: 'bg-palette-yellow-dark'},
  {code: 'blue', label: 'Blue', bg: 'bg-palette-blue-dark'},
  {code: 'white', label: 'White', bg: 'bg-white'},
];

export function ProductListColorFilter() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelected = (filter: any) => () => {
    setSelected(codes =>
      codes.includes(filter.code)
        ? codes.filter(c => c !== filter.code)
        : [...codes, filter.code],
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <h6 className="font-semibold">Color</h6>
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <div
            key={filter.code}
            onClick={toggleSelected(filter)}
            className={`${selected.includes(filter.code) ? 'bg-[#F6F1FF]' : 'bg-transparent'} inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer`}>
            <span
              className={cn('rounded-full w-4 h-4 min-w-4', filter.bg)}></span>
            <span className="text-xs font-medium text-primary">
              {filter.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ProductListColorFilter;
