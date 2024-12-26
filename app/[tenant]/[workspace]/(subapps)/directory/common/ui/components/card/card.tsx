import Link from 'next/link';

import {cn} from '@/utils/css';

import {Category} from '../pills';
import Image from 'next/image';
import {getImageURL} from '@/utils/files';
import {colors} from '../../../constants';

export type CategoryProps = {
  title?: string;
  color?: string;
};
export type CardProps = {
  item: {
    id: string;
    title?: string;
    address?: string;
    description?: string;
    city?: string;
    image?: {
      id: string;
    };
    directoryEntryCategorySet?: CategoryProps[];
  };
  url: string;
  small?: boolean;
  tenant: string;
};

export function Card(props: CardProps) {
  const {item, url, small, tenant} = props;
  return (
    <Link
      href={{pathname: url}}
      className="flex bg-card rounded-lg gap-1 justify-between">
      <div className="p-3 space-y-2 grow">
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 ',
            small && 'hidden',
          )}>
          {item?.directoryEntryCategorySet?.map((item, index) => (
            <Category
              name={item?.title}
              key={index}
              variant={item?.color}
              className={colors[item.color as keyof typeof colors] ?? ''}
            />
          ))}
        </div>
        <h4 className="font-semibold">{item.title}</h4>
        <p className="text-success text-sm"> {item.address}</p>
        <p className="text-xs line-clamp-3">{item.description}</p>
      </div>

      <Image
        width={150}
        height={138}
        className="rounded-r-lg  object-cover"
        src={getImageURL(item?.image?.id, tenant, {noimage: true})}
        alt="image"
      />
    </Link>
  );
}
