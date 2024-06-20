'use client';
import React, { useState } from 'react';
// ---- CORE IMPORTS ---- //
export function ProductListColorFilter() {
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [bgColor1, setBgColor1] = useState<boolean>(false);
  const handleClick = () => {
    setBgColor(!bgColor);
  };
  const handleClick1 = () => {
    setBgColor1(!bgColor1);
  };
  return (
    <div className="flex flex-col gap-2">
      <h6 className='text-base font-semibold'>Color</h6>
      <div className="flex flex-wrap gap-2">
        <div
          className={`${bgColor ? 'bg-[#F6F1FF]' : 'bg-transparent'} inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer`}
          onClick={handleClick}
        >
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-red"></span>
          <span className="text-xs font-medium text-primary">Red</span>
        </div>
        <div
          className={`${bgColor1 ? 'bg-[#F6F1FF]' : 'bg-transparent'} inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer`}
          onClick={handleClick1}
        >
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-black"></span>
          <span className="text-xs font-medium text-primary">Black</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-pink"></span>
          <span className="text-xs font-medium text-primary">Pink</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-purple"></span>
          <span className="text-xs font-medium text-primary">Purple</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-yellow"></span>
          <span className="text-xs font-medium text-primary">Yellow</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-orange"></span>
          <span className="text-xs font-medium text-primary">Orange</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-green"></span>
          <span className="text-xs font-medium text-primary">Green</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-grey"></span>
          <span className="text-xs font-medium text-primary">Grey</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-blue"></span>
          <span className="text-xs font-medium text-primary">Blue</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-white"></span>
          <span className="text-xs font-medium text-primary">White</span>
        </div>
        <div className="inline-flex items-center gap-4 px-2 py-1 border border-primary rounded-full cursor-pointer">
          <span className="rounded-full w-4 h-4 min-w-4 bg-product_filter-brown"></span>
          <span className="text-xs font-medium text-primary">Brown</span>
        </div>
      </div>
    </div>
  );
}
export default ProductListColorFilter;