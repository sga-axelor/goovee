'use client';

export function SearchItem({
  result,
  onClick,
}: {
  result: any;
  onClick: (result: {id: string; title: string}) => void;
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
