'use client';

export function SearchItem({
  result,
  onClick,
}: {
  result: any;
  onClick: (result: {id: string; title: string}) => void;
}) {
  const {id, title} = result;
  return (
    <div
      key={id}
      onClick={() => onClick(result)}
      className="flex flex-col gap-2 cursor-pointer">
      <div className="flex justify-between">
        <div className="text-sm font-semibold">{title}</div>
        <div className="flex gap-2 h-max"></div>
      </div>
    </div>
  );
}

export default SearchItem;
