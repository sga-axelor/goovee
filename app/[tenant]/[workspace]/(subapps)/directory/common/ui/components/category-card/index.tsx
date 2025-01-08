import Link from 'next/link';

import {DynamicIcon} from '@/ui/components';
import {cn} from '@/utils/css';

export type CategoryCardProps = {
  id: string;
  workspaceURI: string;
  label: string;
  icon?: string;
  iconClassName?: string;
};

export function CategoryCard(props: CategoryCardProps) {
  const {label, icon, iconClassName, workspaceURI, id} = props;

  return (
    <Link href={`${workspaceURI}/directory/category/${id}`}>
      <div
        className={cn(
          iconClassName,
          'flex items-center justify-center  h-14 w-14 rounded-full m-auto',
        )}>
        {icon && <DynamicIcon className="h-10 w-10 " icon={`md-${icon}`} />}
      </div>

      <p className="text-[0.8125rem] font-semibold text-center mt-1">{label}</p>
    </Link>
  );
}
