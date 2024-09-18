import {forwardRef} from 'react';
import {Maybe} from '@/types/util';
import {Tag} from '@/ui/components';
import type {Variant} from '@/ui/components/tag';

const statusMap = new Map<string, Variant>();
statusMap.set('New', 'default');
statusMap.set('In progress', 'yellow');
statusMap.set('Done', 'success');
statusMap.set('Cancelled', 'destructive');

type PillProps = {
  name: Maybe<string>;
};

export const Status = forwardRef<HTMLDivElement, PillProps>(({name}, ref) => {
  if (!name) return null;

  return (
    <Tag
      variant={statusMap.get(name) ?? 'default'}
      className="text-[12px] py-1 w-max"
      outline>
      {name}
    </Tag>
  );
});

const priorityMap = new Map<string, Variant>();
priorityMap.set('High', 'orange');
priorityMap.set('Low', 'success');
priorityMap.set('Normal', 'yellow');
priorityMap.set('Urgent', 'destructive');

export const Priority = forwardRef<HTMLDivElement, PillProps>(({name}, ref) => {
  if (!name) return null;

  return (
    <Tag
      variant={priorityMap.get(name) ?? 'default'}
      className="text-[12px] py-1 w-max">
      {name}
    </Tag>
  );
});

export const Category = forwardRef<HTMLDivElement, PillProps>(({name}, ref) => {
  if (!name) return null;
  return (
    <Tag variant="purple" className="text-[12px] py-1 me-5 rounded">
      {name}
    </Tag>
  );
});
