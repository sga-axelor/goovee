'use client';

export function SearchItem({result, onClick}: {result: any; onClick: any}) {
  const {id, name} = result;
  return (
    <div
      key={id}
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() => onClick(result)}>
      <div className="flex justify-between">
        <div className="text-sm font-semibold">{name}</div>
      </div>
    </div>
  );
}

export default SearchItem;
