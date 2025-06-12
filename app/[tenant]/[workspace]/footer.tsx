import Link from 'next/link';
import Image from 'next/image';

import {i18n} from '@/locale';
import type {PortalWorkspace} from '@/types';

export default function Footer({workspace}: {workspace: PortalWorkspace}) {
  const displayContact = workspace?.config?.isDisplayContact;
  const contactEmail = workspace?.config?.contactEmailAddress?.address;

  return (
    <>
      <div className="mt-auto bg-background text-foreground px-4 py-1 z-10 lg:flex hidden items-center justify-center border-t border-border border-solid">
        <div className="px-4">
          {displayContact && (
            <div className="flex flex-col gap-0.5 items-start text-xs">
              <p className="font-medium">{workspace?.config?.contactName}</p>
              <p>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
              <p>{workspace?.config?.contactPhone}</p>
            </div>
          )}
        </div>
        <div className="mx-auto">
          <Link
            href={`https://axelor.com/fr/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center">
            <div className="text-xs">{i18n.t('Powered by')}</div>
            <Image
              src="/images/axelor.png"
              alt="Axelor Logo"
              width={50}
              height={25}
              className="h-6 ml-1"
              style={{width: 'auto', height: 'auto'}}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
