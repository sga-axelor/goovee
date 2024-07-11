'use client';

import React from 'react';

export const Banner = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className="flex-col lg:w-auto w-full h-[300px] lg:h-[353px] flex items-center justify-center bg-no-repeat bg-[#1c1f55] bg-cover"
      style={{backgroundImage: 'url("/images/hero-bg.svg")'}}>
      <div className="px-4 flex text-white items-center flex-col justify-center">
        <h2 className="lg:text-[32px] text-2xl font-semibold mb-2">{title}</h2>
        <p className="lg:text-lg text-base font-medium mb-8 md:max-w-screen-sm lg:max-w-screen-md text-center">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
};

export default Banner;
