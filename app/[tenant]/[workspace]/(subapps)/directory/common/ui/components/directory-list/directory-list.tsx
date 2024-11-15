/* eslint-disable @next/next/no-img-element */
import {forwardRef} from 'react';
import {Tag} from '@/ui/components';
import {cn} from '@/utils/css';
import {Maybe} from '@/types/util';
import {Variant} from '@/ui/components/tag';

type PillProps = {
  name: Maybe<string>;
  className?: string;
  variant?: string;
};

const data = [
  {
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
  {
    name: 'Entry Name',
    address: '43 Mainstreet - London',
    image: '',
    description:
      'Lorem ipsum dolor sit amet consectetur. Neque diam integer purus aenean porttitor morbi. Turpis.',
  },
];
const categoryMap = new Map<string, Variant>();
categoryMap.set('service', 'purple');
categoryMap.set('industry', 'yellow');
categoryMap.set('wholesale', 'success');

const category = [{name: 'service'}, {name: 'industry'}, {name: 'wholesale'}];

export const Category = forwardRef<HTMLDivElement, PillProps>(
  ({name, className}, ref) => {
    if (!name) return null;
    return (
      <Tag
        variant={categoryMap?.get(name) ?? 'default'}
        className={cn('text-[10px] py-1 rounded', className)}>
        {name}
      </Tag>
    );
  },
);

Category.displayName = 'Category';

export function DirectoryList() {
  return (
    <>
      {data.map((item, index) => (
        <div
          className="flex bg-card rounded-lg gap-5 justify-between"
          key={index}>
          <div className="p-3 space-y-2">
            {category.map((item, index) => (
              <Category
                name={item?.name}
                key={index}
                className="me-3"
                variant={item?.name}
              />
            ))}

            <h4 className="font-semibold">{item?.name}</h4>
            <p className="text-success text-sm"> {item?.address}</p>
            <p className="text-xs">{item?.description}</p>
          </div>
          <div className="bg-yellow-200 w-[150px] h-[153px] rounded-r-lg"></div>
        </div>
      ))}
    </>
  );
}
