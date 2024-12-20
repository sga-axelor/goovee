'use client';

// ---- CORE IMPORTS ---- //
import {BadgeList} from '@/ui/components';

export function SearchItem({result, onClick}: {result: any; onClick: any}) {
  const {id, slug, title, categorySet, description} = result;
  return (
    <div
      key={id}
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => onClick(slug)}>
      <div className="flex justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <BadgeList
          items={categorySet}
          labelClassName="rounded font-normal text-[0.5rem]"
          rootClassName="gap-2 h-max"
        />
      </div>
      <div className="line-clamp-1 font-normal text-xs text-black">
        {description}
      </div>
    </div>
  );
}

export default SearchItem;
