'use client';
export default function Layout({children}: {children: React.ReactNode}) {
  return <div className="py-2 md:py-4 px-4 md:px-12">{children}</div>;
}
