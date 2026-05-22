'use client';

// ---- LOCAL IMPORTS ---- //
import {SearchResult} from '@/subapps/forum/common/types/forum';

export function SearchItem({
  result,
  onClick,
}: {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
}) {
  const {id, title, forumGroup} = result;
  return (
    <div
      key={id}
      onClick={() => onClick(result)}
      className="flex flex-col gap-2 cursor-pointer">
      <div className="flex justify-between text-sm">
        <div className="font-semibold">{title}</div>
        <div className="flex gap-2 h-max">{forumGroup.name}</div>
      </div>
    </div>
  );
}

export default SearchItem;
