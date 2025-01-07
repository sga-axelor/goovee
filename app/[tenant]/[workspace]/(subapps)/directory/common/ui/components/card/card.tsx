import Link from 'next/link';

import {cn} from '@/utils/css';

import {getImageURL} from '@/utils/files';
import Image from 'next/image';
import {colors} from '../../../constants';
import {Entry, ListEntry} from '../../../orm';
import {Category} from '../pills';

export type CardProps = {
  item: ListEntry | Entry;
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
        <h4 className="font-semibold line-clamp-1">{item.title}</h4>
        <p className="text-success text-sm line-clamp-3">
          {
            //TODO: show full address
          }
          {item.address?.streetName}
        </p>
        <p className="text-xs line-clamp-3">{item.description}</p>
      </div>

      <Image
        width={150}
        className="rounded-r-lg h-[138px]"
        src={getImageURL(item?.image?.id, tenant, {noimage: true})}
        alt="image"
      />
    </Link>
  );
}
