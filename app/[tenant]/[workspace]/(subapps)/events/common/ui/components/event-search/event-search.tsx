'use client';
import React from 'react';

// ---- CORE IMPORTS ---- //
import {Command, CommandInput} from '@/ui/components/command';

export const EventSearch = ({
  search,
  handleSearch,
  onKeyDown,
}: {
  search: string;
  onKeyDown: any;
  handleSearch: (x: string) => void;
}) => {
  return (
    <>
      <div className="w-full relative">
        <Command className="p-0 bg-white">
          <CommandInput
            placeholder="Search here"
            className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] py-4 pr-[132px] h-14 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
            value={search}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
            onKeyDown={e => onKeyDown && onKeyDown(e)}
          />
        </Command>
      </div>
    </>
  );
};
