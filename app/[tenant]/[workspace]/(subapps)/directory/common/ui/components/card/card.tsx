import Link from 'next/link';
import {Category} from '../pills';

const category = [{name: 'service'}, {name: 'industry'}, {name: 'wholesale'}];

export type CardProps = {
  item: {id: string; name: string; address: string; description: string};
  url: string;
};

export function Card(props: CardProps) {
  const {item, url} = props;
  return (
    <Link
      href={{pathname: url}}
      className="flex bg-card rounded-lg gap-1 justify-between">
      <div className="p-3 space-y-2 grow">
        <div className="flex flex-wrap items-center gap-2">
          {category.map((item, index) => (
            <Category name={item?.name} key={index} variant={item?.name} />
          ))}
        </div>
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-success text-sm"> {item.address}</p>
        <p className="text-xs line-clamp-3">{item.description}</p>
      </div>
      <div className="bg-yellow-200 w-[150px] shrink-0 rounded-r-lg"></div>
    </Link>
  );
}
