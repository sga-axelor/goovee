'use client';
import React, {useCallback, useEffect, useState} from 'react';
import {debounce} from 'lodash';

// ---- CORE IMPORTS ---- //
import {Command, CommandInput} from '@/ui/components/command';

export const EventSearch = ({
  handleSearch,
}: {
  handleSearch: (x: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedFindQuery = useCallback(
    debounce(async (query: string) => {
      handleSearch(query.trim());
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedFindQuery(searchQuery);
  }, [searchQuery, debouncedFindQuery]);

  return (
    <>
      <div className="w-full relative">
        <Command className="p-0 bg-white">
          <CommandInput
            placeholder="Search here"
            className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] py-4 pr-[132px] h-14 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
            value={searchQuery}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </Command>
      </div>
    </>
  );
};
