import {cn} from '@/utils/css';
import Link from 'next/link';
import {IconType} from 'react-icons';

export type DirectoryCardsProps = {
  id: string;
  workspaceURI: string;
  label: string;
  icon: IconType;
  iconClassName: string;
};

export function DirectoryCards(props: DirectoryCardsProps) {
  const {label, icon: Icon, iconClassName, workspaceURI, id} = props;

  return (
    <Link href={`${workspaceURI}/directory/category/${id}`}>
      <div
        className={cn(
          iconClassName,
          'flex items-center justify-center  h-14 w-14 rounded-full m-auto',
        )}>
        <Icon className="h-10 w-10 " />
      </div>

      <p className="text-[0.8125rem] font-semibold text-center mt-1">{label}</p>
    </Link>
  );
}
