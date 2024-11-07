'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {debounce} from 'lodash';

// ---- CORE IMPORTS ---- //
import {cn} from '@/utils/css';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components/command';
import {NO_RESULTS_FOUND} from '@/constants';

export const Search = ({
  findQuery,
  renderItem,
  searchKey = 'title',
  onItemClick,
  onSearch,
  value = '',
}: {
  findQuery: any;
  renderItem: any;
  searchKey?: string;
  onItemClick?: any;
  onSearch?: any;
  value?: string;
}) => {
  const RenderItem = renderItem;
  const [search, setSearch] = useState(value || '');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const debouncedFindQuery = useCallback(
    debounce(async (query: string) => {
      if (query) {
        const results = await findQuery();
        setResults(results);
      } else {
        setResults([]);
      }
    }, 500),
    [findQuery],
  );

  useEffect(() => {
    setOpen(search.length > 0);
    debouncedFindQuery(search);
  }, [search, debouncedFindQuery]);

  useEffect(() => {
    if (onSearch) {
      onSearch(search);
    }
  }, [search, onSearch]);

  useEffect(() => {
    value && setSearch(value);
  }, [value]);

  return (
    <>
      <div className="w-full relative">
        <Command className="p-0 bg-white">
          <CommandInput
            placeholder="Search here"
            className="lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] py-4 pr-[132px] h-14 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black"
            value={search}
            onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />

          <CommandList
            className={cn(
              'absolute bg-white top-[60px] right-0 border border-grey-1 rounded-lg no-scrollbar text-main-black z-50 w-full p-0',
              open ? 'block' : 'hidden',
            )}>
            <CommandEmpty>{NO_RESULTS_FOUND}</CommandEmpty>
            <CommandGroup className="p-2">
              {Boolean(results?.length)
                ? results.map((result: any) => (
                    <CommandItem
                      key={result.id}
                      value={result[searchKey]}
                      className="block py-2 sm:px-6">
                      <RenderItem result={result} onClick={onItemClick} />
                    </CommandItem>
                  ))
                : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </>
  );
};

export default Search;
