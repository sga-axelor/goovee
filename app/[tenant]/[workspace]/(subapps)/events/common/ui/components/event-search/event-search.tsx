'use client';
import React, {useEffect, useState} from 'react';

// ---- CORE IMPORTS ---- //
import {Command, CommandInput} from '@/ui/components/command';
import {useSearchParams} from '@/ui/hooks';
import {DEFAULT_PAGE, KEY, URL_PARAMS} from '@/constants';

export const EventSearch = ({query = ''}: {query: string}) => {
  const [search, setSearch] = useState(query);
  const {update} = useSearchParams();
  const updateSearchQuery = () => {
    update(
      [
        {key: URL_PARAMS.page, value: DEFAULT_PAGE},
        {key: URL_PARAMS.query, value: search},
      ],
      {scroll: false},
    );
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY.enter) {
      updateSearchQuery();
    }
  };
  const handleSearch = (searchKey: string) => {
    setSearch(searchKey);
  };

  useEffect(() => {
    if (search.length === 0) {
      updateSearchQuery();
    }
  }, [search]);

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
