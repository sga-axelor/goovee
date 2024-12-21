'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/i18n';
import {cn} from '@/utils/css';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {
  GLOBAL_MENU,
  WORKSPACE_MENU,
  ADMIN_WORKSPACE_MENU,
} from './common/constants';

type Item = {
  label: string;
  route: string;
};

function MenuItem({item}: {item: Item}) {
  const pathname = usePathname();
  const {workspaceURL} = useWorkspace();

  return (
    <div
      key={item.route}
      className={cn('p-1 ps-8 rounded-sm cursor-pointer', {
        ['bg-success-light text-success']: pathname.includes(item.route),
      })}>
      <Link key={item.route} href={`${workspaceURL}/account/${item.route}`}>
        {item.label}
      </Link>
    </div>
  );
}

function Menu({title, items}: {title: string; items: Item[]}) {
  return (
    <div className="space-y-2">
      <h2 className="py-1 px-4 text-sm font-semibold">{title}</h2>
      <div className="h-[1px] border-b" />
      <div className="space-y-8">
        {items.map(item => (
          <MenuItem key={item.route} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar({isAdmin}: {isAdmin: boolean}) {
  return (
    <div className="border-e space-y-10 py-2">
      <Menu title={i18n.get('Global')} items={GLOBAL_MENU} />
      <Menu
        title={i18n.get('Workspace')}
        items={isAdmin ? ADMIN_WORKSPACE_MENU : WORKSPACE_MENU}
      />
    </div>
  );
}
