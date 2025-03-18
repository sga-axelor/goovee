'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer({}: {}) {
  return (
    <>
      <div className="mt-auto bg-background text-foreground px-6 py-2 flex items-center justify-center border-t border-border border-solid">
        <Link
          href={`https://axelor.com/fr/`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center">
          <div>Powered by</div>
          <Image
            src="/images/logo.png"
            alt="Axelor Logo"
            width={75}
            height={37}
            className="h-8 ml-2"
            style={{width: 'auto', height: 'auto'}}
          />
        </Link>
      </div>
    </>
  );
}
