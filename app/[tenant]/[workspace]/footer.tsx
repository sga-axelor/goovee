'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer({}: {}) {
  return (
    <>
      <div className="mt-auto bg-background text-foreground px-4 py-1 flex items-center justify-center border-t border-border border-solid">
        <Link
          href={`https://axelor.com/fr/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center">
          <div className="text-xs">Powered by</div>
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
    </>
  );
}
