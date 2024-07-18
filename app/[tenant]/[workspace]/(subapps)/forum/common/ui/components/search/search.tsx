'use client';

import {MdOutlineSearch} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {Button, Input} from '@/ui/components';
import {SEARCH_HERE} from '@/subapps/forum/common/constants';

export const Search = () => {
  return (
    <div className="relative">
      <Input
        className="border-none placeholder:text-sm"
        placeholder={SEARCH_HERE}
      />
      <Button className="bg-success px-2 py-1 h-7 w-9 hover:bg-success-dark absolute top-[6px] right-[9px]">
        <MdOutlineSearch className="" />
      </Button>
    </div>
  );
};

export default Search;
