'use client';

import {useEffect, useState} from 'react';
import {MdOutlineSearch} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button, Input} from '@/ui/components';
import {SEARCH_HERE} from '@/subapps/forum/common/constants';

export const Search = ({
  onChange = () => {},
}: {
  onChange: (value: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState<string>('');

  useEffect(() => {
    setTimeout(() => {
      onChange(searchValue);
    }, 2000);
  }, [searchValue]);

  return (
    <div className="relative">
      <Input
        value={searchValue}
        className="border-none placeholder:text-sm"
        placeholder={SEARCH_HERE}
        onChange={e => {
          const value = e.target.value;
          setSearchValue(value);
        }}
      />
      <Button className="bg-success px-2 py-1 h-7 w-9 hover:bg-success-dark absolute top-[6px] right-[9px]">
        <MdOutlineSearch className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Search;
