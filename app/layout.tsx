import {Poppins as FontSans} from 'next/font/google';
import type {Metadata} from 'next';

// ---- CORE IMPORTS ---- //
import {findTheme} from '@/orm/theme';
import {Toaster} from '@/ui/components/toaster';

// ---- LOCAL IMPORTS ---- //
import Theme from './theme';
import Locale from './locale';
import Session from './session';
import './globals.css';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Goovee',
  description: 'Next generation portal by Axelor',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await findTheme();

  return (
    <Theme theme={theme}>
      <html lang="en">
        <body className={fontSans.className}>
          <Session>
            <Locale>{children}</Locale>
          </Session>
          <Toaster />
        </body>
      </html>
    </Theme>
  );
}
