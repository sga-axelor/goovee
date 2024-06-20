'use client';

import Link from 'next/link';
import {useSession} from 'next-auth/react';

// ---- CORE IMPORTS ---- //
import {i18n} from '@/lib/i18n';
import {useWorkspace} from '@/app/[tenant]/[workspace]/workspace-context';
import {SUBAPP_PAGE} from '@/constants';
import Icons from '@/utils/Icons';

export default function Content({subapps}: {subapps: any}) {
  const {workspaceURI} = useWorkspace();
  const {data: session} = useSession();

  return (
    <>
      <h4 className="text-lg font-medium mb-6">
        {i18n.get('My Account')} {session ? `- ${session?.user?.name}` : ''}{' '}
        {session?.user && (
          <span className="text-base">
            ({session?.user?.email})
          </span>
        )}
      </h4>
      <div className="flex flex-col gap-4">
        {subapps
          .filter((app: any) => app.installed && app.showInMySpace)
          .sort(
            (app1: any, app2: any) =>
              app1.orderForMySpaceMenu - app2.orderForMySpaceMenu,
          )
          .reverse()
          .map(({code, name, icon, color, background}: any) => {
            const page = SUBAPP_PAGE[code as keyof typeof SUBAPP_PAGE] || '';
            return (
              <Link
                key={code}
                href={`${workspaceURI}/${code}${page}`}
                className="no-underline">
                <div className="p-6 rounded-lg border bg-card text-card-foreground">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[4.5rem] h-[4.5rem] p-4 rounded-lg flex items-center justify-center"
                      style={{
                        background,
                        color,
                      }}>
                      {icon ? <Icons name={icon} className="text-2xl" /> : null}
                    </div>
                    <p className="text-lg font-semibold mb-0">
                      {i18n.get(name)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>
    </>
  );
}
