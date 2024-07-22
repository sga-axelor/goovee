'use client';

// ---- CORE IMPORTS ---- //
import {Badge} from '@/ui/components/badge';

export function SearchItem({result, onClick}: {result: any; onClick: any}) {
  const {id, slug, title, categorySet, description} = result;
  return (
    <div
      key={id}
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => onClick(slug)}>
      <div className="flex justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex gap-2 h-max">
          {categorySet.map((category: any, i: any) => (
            <Badge
              key={i}
              className="px-2 p-1 rounded font-normal text-[8px] leading-[12px]">
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

export default SearchItem;
