'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {Input} from '@/ui/components/input';
import {Badge} from '@/ui/components/badge';
import {ScrollArea} from '@/ui/components/scroll-area';

// ---- LOCAL IMPORTS ---- //
import {i18n} from '@/subapps/news/common/utils';
import {SEARCH_HERE} from '@/subapps/news/common/constants';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

export const Search = ({items}: {items: any}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const route = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value;
    setSearch(value);
  };

  const handleClick = (slug: string) => {
    route.push(`${workspaceURI}/news/article/${slug}`);
  };

  useEffect(() => {
    const searchString = search.toLowerCase();
    const filteredResult = items.filter((item: any) => {
      const titleMatch = item?.title?.toLowerCase().includes(searchString);
      const categoryMatch = item.categorySet.some((category: any) => {
        return category.name.toLowerCase().includes(searchString);
      });

      return titleMatch || categoryMatch;
    });
    setResults(filteredResult);
  }, [search, items]);

  return (
    <>
      <div className="flex ietms-center relative w-full">
        <Input
          className="py-4 px-4 h-14 w-full placeholder:text-palette-mediumGray text-base font-medium text-black"
          placeholder={i18n.get(SEARCH_HERE)}
          value={search}
          onChange={handleChange}
        />
      </div>
      {search.length > 0 && results.length > 0 && (
        <div className="w-full bg-white text-black border rounded-lg border-palette-gray-100 absolute z-50">
          <ScrollArea className="max-h-[395px] w-full rounded-lg border p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {results.map(
                ({id, slug, title, categorySet, description}: any) => (
                  <div
                    key={id}
                    className="flex flex-col gap-2 cursor-pointer"
                    onClick={() => handleClick(slug)}>
                    <div className="flex justify-between">
                      <div className="text-sm font-semibold">{title}</div>
                      <div className="flex gap-2">
                        {categorySet.map((category: any, i: any) => (
                          <Badge
                            key={i}
                            className="px-2 p-1 rounded font-normal text-[8px] h-fit">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="line-clamp-1 font-normal text-xs text-palette-gray-400">
                      {description}
                    </div>
                  </div>
                ),
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default Search;
