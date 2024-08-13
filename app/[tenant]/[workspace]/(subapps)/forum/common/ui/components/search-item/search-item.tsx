'use client';

export function SearchItem({result}: {result: any}) {
  const {id, title} = result;
  return (
    <div key={id} className="flex flex-col gap-2 cursor-pointer">
      <div className="flex justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex gap-2 h-max"></div>
      </div>
    </div>
  );
}

export default SearchItem;
