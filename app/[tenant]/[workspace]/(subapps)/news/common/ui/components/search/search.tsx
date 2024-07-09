'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components/command';
import {cn} from '@/utils/css';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';

// ---- LOCAL IMPORTS ---- //
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {findSearchNews} from '@/subapps/news/common/actions/action';

export const Search = ({items}: {items: any}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const route = useRouter();
  const {workspaceURI} = useWorkspace();

  const handleClick = (slug: string) => {
    route.push(`${workspaceURI}/news/article/${slug}`);
  };

  useEffect(() => {
    setOpen(search ? true : false);
    if (search) {
      findSearchNews().then(setResults);
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
              setSearch(e.target.value)
            }
          />

          <CommandList
            className={cn(
              'absolute bg-white top-[60px] right-0 border border-grey-1 rounded-lg no-scrollbar text-main-black z-50 w-full p-0',
              open ? 'block' : 'hidden',
            )}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="p-2">
              {Boolean(results?.length)
                ? results.map((result: any) => (
                    <CommandItem
                      key={result.id}
                      value={result.title}
                      className="block py-2 sm:px-6">
                      <Item result={result} onClick={handleClick} />
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

function Item({result, onClick}: {result: any; onClick: any}) {
  const {id, slug, title, categorySet, description} = result;
  return (
    <div
      key={id}
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => onClick(slug)}>
      <div className="flex justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex gap-2">
          {categorySet.map((category: any, i: any) => (
            <Badge
              key={i}
              className="px-2 p-1 rounded font-normal text-[8px] leading-[12px] ">
              {category.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="line-clamp-1 font-normal text-xs text-black">
        {description}
      </div>
    </div>
  );
}

export default Search;
