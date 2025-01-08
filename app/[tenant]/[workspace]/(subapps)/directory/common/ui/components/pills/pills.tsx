import {Maybe} from '@/types/util';
import {Tag} from '@/ui/components/tag';
import {cn} from '@/utils/css';
import {forwardRef} from 'react';

export type PillProps = {
  name: Maybe<string>;
  className?: string;
};

export const Category = forwardRef<HTMLDivElement, PillProps>(
  ({name, className}, ref) => {
    if (!name) return null;
    return (
      <Tag
        variant="default"
        className={cn('text-[10px] py-1 rounded', className)}>
        {name}
      </Tag>
    );
  },
);

Category.displayName = 'Category';
