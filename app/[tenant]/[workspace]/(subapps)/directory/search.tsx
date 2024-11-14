'use client';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/components/command';
import {useToast} from '@/ui/hooks';
import {cn} from '@/utils/css';
import {debounce} from 'lodash';
import {ChangeEvent, useCallback, useMemo, useRef, useState} from 'react';

export function Search({
  className,
  inputClassName,
}: {
  inputClassName?: string;
  className?: string;
}) {
  const {toast} = useToast();
  const [search, setSearch] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const searchRef = useRef<string | undefined>();

  const fetchSearchResult = useMemo(
    () =>
      debounce(async (search: string) => {
        try {
        } catch (e) {
          toast({
            variant: 'destructive',
            title: i18n.get('Something went wrong'),
          });
        } finally {
          if (searchRef.current === search) {
            setLoading(false);
          }
        }
      }, 500),
    [toast],
  );

  const handleSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setLoading(true);
      setOpen(!!query);
      searchRef.current = query;
      setSearch(query);
      fetchSearchResult(query);
    },
    [fetchSearchResult],
  );

  const handleRedirection = () => {};

  return (
    <div className={cn('w-full relative', className)}>
      <Command className="p-0 bg-card" shouldFilter={false}>
        <CommandInput
          placeholder="Search here"
          className={cn(
            'lg:placeholder:text-base placeholder:text-sm placeholder:font-normal lg:placeholder:font-medium pl-[10px] pr-[132px] h-12 lg:pl-4 border-none text-base font-medium rounded-lg focus-visible:ring-offset-0 focus-visible:ring-0 text-main-black',
            inputClassName,
          )}
          value={search}
          onChangeCapture={handleSearch}
          loading={loading}
        />

        <CommandList
          className={cn(
            'absolute bg-card top-[60px] right-0 border border-grey-1 rounded-lg no-scrollbar text-main-black z-50 w-full p-0',
            open ? 'block' : 'hidden',
          )}>
          <CommandEmpty>
            {loading ? i18n.get('Searching...') : i18n.get('No results found.')}
          </CommandEmpty>
          <CommandGroup className="p-2">
            {Boolean(searchResult?.length)
              ? searchResult.map(result => (
                  <CommandItem
                    key={result.id}
                    value={result.id}
                    onSelect={handleRedirection}
                    className="block py-2 sm:px-6 cursor-pointer">
                    <div className="leading-5 text-sm space-y-2 p-3">
                      <h3 className="font-semibold line-clamp-1">
                        {result.fullName}
                      </h3>
                    </div>
                  </CommandItem>
                ))
              : null}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

export default Search;
