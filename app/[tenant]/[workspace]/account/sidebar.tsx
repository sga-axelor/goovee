'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

// ---- CORE IMPORTS ---- //
import { cn } from '@/utils/css';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';

// ---- LOCAL IMPORTS ---- //
import {MENU} from './common/constants';

export default function Sidebar() {
  const pathname = usePathname();
  const {workspaceURL} = useWorkspace();

  return (
    <div className="border-e space-y-6 px-2">
      {MENU.map(item => (
        <div
          key={item.route}
          className={cn('p-1 rounded-sm cursor-pointer', {
            ['bg-success-light text-success']: pathname.includes(item.route),
          })}>
          <Link key={item.route} href={`${workspaceURL}/account/${item.route}`}>
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  );
}
