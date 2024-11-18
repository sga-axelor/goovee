import {Maybe} from '@/types/util';
import {Variant, Tag} from '@/ui/components/tag';
import {cn} from '@/utils/css';
import {forwardRef} from 'react';

const categoryMap = new Map<string, Variant>();
categoryMap.set('service', 'purple');
categoryMap.set('industry', 'yellow');
categoryMap.set('wholesale', 'success');

export type PillProps = {
  name: Maybe<string>;
  className?: string;
  variant?: string;
};

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
