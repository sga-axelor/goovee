'use client';

import NextLink from 'next/link';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
};

export function Link({
  href,
  children,
  className = '',
  prefetch = false,
  ...rest
}: Props) {
  return (
    <NextLink href={href} prefetch={prefetch} className={className} {...rest}>
      {children}
    </NextLink>
  );
}

export default Link;
